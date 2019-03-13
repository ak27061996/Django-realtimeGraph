from django.shortcuts import render_to_response,render, redirect
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseNotFound
from home.models import report
import math
import random
import os
import json
from datetime import datetime, timedelta
import sched, time
from threading import Thread
from django.contrib.auth.decorators import login_required
s = sched.scheduler(time.time, time.sleep)
NOW=datetime.now()
from drealtime import iShoutClient
ishout_client = iShoutClient()
voltage=[]
current=[]
timeNow=[]
ms=0
def sensor(sc):
    global current,sendData,voltage,NOW,inser_into_db,gettime,timeNow
    v=random.sample(range(1, 100), 5)
    c=random.sample(range(1, 100), 5)
    voltage+=v
    current+=c
    now = gettime()
    timeNow+=now
    sendData(json.dumps(v),json.dumps(c),json.dumps(now))
    if(len(current)>50):
        inser_into_db()    
    s.enter(2,2, sensor, (sc,))

def getDatafromSensor():
    s.enter(2,1, sensor, (s,))
    s.run()

@login_required
def index(request):
    myrunnig=Thread(target = getDatafromSensor)
    myrunnig.daemon = True
    myrunnig.start()
    reported=report.objects.all()
    vv=[]
    cc=[]
    tt=[]
    for val in reported:
        vv.append(val.volt)
        cc.append(val.current)
        tt.append(val.timestamp)
    stat={'volt' : vv,'current':cc,'time':tt}
    # print stat
    return render_to_response('home/plot.html',{'statics':json.dumps(stat)},context_instance=RequestContext(request) )

def sendData(v,c,now):
    ishout_client.emit(
        '1',
        'notifications',
        data={ 'volt' : v,'current':c,'time':now},
    )

def inser_into_db():
    global current,voltage,timeNow
    length=len(voltage)
    bulk_entry=[]
    print "TimeStamp\t\tVoltage\t\tCurrent\t\tPower"
    for i in range(0,length):
        new_report =report()
        new_report.current=(current[i])
        new_report.volt=(voltage[i])
        new_report.timestamp=timeNow[i]
        timess=(timeNow[i][:-4] if len(timeNow[i])>8 else timeNow[i]+'.00' )
        print timess,"\t\t",voltage[i],"\t\t",current[i],"\t\t",current[i]*voltage[i]
        bulk_entry.append(new_report)
    report.objects.bulk_create(bulk_entry)
    voltage=[]
    current=[]
    timeNow=[]

def remove(request):
    # global myrunnig
    s=None;
    report.objects.all().delete()
    return HttpResponse("deleted") #index(request)

def gettime():
    global ms
    ttm=[]
    for i in range(0,5):
        tt=timedelta(milliseconds=ms)+timedelta(hours=NOW.hour, minutes=NOW.minute, seconds=NOW.second)
        ms=ms+200
        ttm.append(str(tt))
    return ttm 