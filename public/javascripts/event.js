'use strict';$(document).ready(function(){function a(j,k,l,m){var n=b(m);f.push(m);var o='<li class="clearfix"><span class="userImg pull-left"><img class="thumb-img" src="'+l+'"/></span><span class="userMsgBody clearfix"><div class="header"><strong>'+k+'</strong><small class="pull-right text-muted timestamp-default"><span class="glyphicon glyphicon-time"></span><span class="timestamp'+g+'">'+n+'</span> ago </small></div><p>'+j+'</p> </span></li>';return g++,o}function b(j){var l=Date.now(),m=moment(l).diff(moment(j));return moment.duration(m).humanize()}var d=io(),f=[],g=0;(function(j){setInterval(function(){for(var k=f.length,l=0;l<k;l++){var m='.timestamp'+l,n=b(f[l]);$(m).text(n)}},j)})(6e4),$('.status-menu li a').click(function(j){var k=$(j.target).text();localUserData.status=k,d.emit('userChangedStatus',localUserData)}),d.on('connect',function(){d.emit('new user',localUserData,localEventData)}),d.on('updateStatusBroadcast',function(j){if(localUserData.userId==j.userId){var k=$('.profile-user-status > a');k.text(' [ Status: '+j.status+' ]'),k.append($('<span class="caret"></span>'))}$('#event-participants').find('span').each(function(){var m=$(this).data('userid');m==j.userId&&$(this).text(' ('+j.status+')')})}),d.on('updateChatUsers',function(j){var k=$('#event-participants');$('.users').remove();for(var m,l=0;l<j.length;l++)m=$('<li class="users user'+l+'">'+j[l].name+' <span data-userid="'+j[l].userId+'" class="statuses status'+l+'">('+j[l].status+')</span></li>'),k.append(m)}),d.on('sendChatHistory',function(j){for(var k=$('.chatUI-msgBody'),l=j.length-1;0<=l;l--)k.find('ul').append(a(j[l].message,j[l].name,j[l].image,j[l].date));k.scrollTop(k.prop('scrollHeight'))}),$('form').submit(function(){var j=$('#inputSendMsg').val(),k={message:j,name:localUserData.name,image:localUserData.img,date:Date.now()};return d.emit('chat message',k),$('#inputSendMsg').val(''),!1}),d.on('chat message',function(j){var k=$('.chatUI-msgBody');k.find('ul').append(a(j.message,j.name,j.image,j.date)),k.scrollTop(k.prop('scrollHeight'))})});
