'use strict';$(document).ready(function(){var a=$('#sport');$('#soccer').on('click',function(f){$('.sport-clicked').removeClass('sport-clicked'),$('#soccer').addClass('sport-clicked'),a.val('Soccer'),a.fadeTo(100,0.1).fadeTo(200,1),f.preventDefault()}),$('#basketball').on('click',function(f){$('.sport-clicked').removeClass('sport-clicked'),$('#basketball').addClass('sport-clicked'),a.val('Basketball'),a.fadeTo(100,0.1).fadeTo(200,1),f.preventDefault()}),$('#volleyball').on('click',function(f){$('.sport-clicked').removeClass('sport-clicked'),$('#volleyball').addClass('sport-clicked'),a.val('Volleyball'),a.fadeTo(100,0.1).fadeTo(200,1),f.preventDefault()}),$('#baseball').on('click',function(f){f.preventDefault(),$('.sport-clicked').removeClass('sport-clicked'),$('#baseball').addClass('sport-clicked'),a.val('Baseball'),a.fadeTo(100,0.1).fadeTo(200,1)}),$('#other').on('click',function(f){f.preventDefault(),$('.sport-clicked').removeClass('sport-clicked'),$('#other').addClass('sport-clicked'),a.val(''),a.fadeTo(100,0.1).fadeTo(200,1),a.focus()});var b=$('#from'),c=$('#to');b.datetimepicker({minDate:moment()}),c.datetimepicker({useCurrent:!1,minDate:moment()}),b.on('dp.change',function(f){c.data('DateTimePicker').minDate(f.date)}),c.on('dp.change',function(f){b.data('DateTimePicker').maxDate(f.date)});var d=$('#maxPlayers');d.change(function(){var f=d.val();$.isNumeric(f)&&0<f?$.isNumeric(f)&&40<f&&d.val(40):d.val(1)}),$('#submit').on('click',function(f){$('#teamupName').val()&&$('#from').val()&&$('#to').val()&&$('#sport').val()&&$('#maxPlayers').val()&&!$('#locationName').val()&&($('p#errorLocation').text('Please Select a Location using Google Maps! Thank you :)'),$('html, body').animate({scrollTop:0},2e3),$('#pac-input').focus(),f.preventDefault())}),$('form').bind('submit',function(){$('#submit').prop('disabled',!0)})});