(function(){
    var script = {
 "mouseWheelEnabled": true,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.MainViewer",
  "this.Image_BEE6FED8_AC35_2F20_41D8_34B6B91DA709",
  "this.Container_806973DA_ADB0_EB72_41E1_4BBDAAEB91FF",
  "this.Container_BC8D06B7_B143_E72C_41CA_E1C4F81682F0",
  "this.HTMLText_B3A95BF7_AD90_5B11_41E1_AC9050095132",
  "this.Container_A797E343_B17D_3EDA_41AB_2CDE4A57AE7C"
 ],
 "id": "rootPlayer",
 "gap": 10,
 "defaultVRPointer": "laser",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "absolute",
 "scripts": {
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "existsKey": function(key){  return key in window; },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getKey": function(key){  return window[key]; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "unregisterKey": function(key){  delete window[key]; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "registerKey": function(key, value){  window[key] = value; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); }
 },
 "width": "100%",
 "scrollBarMargin": 2,
 "downloadEnabled": false,
 "start": "this.init(); this.syncPlaylists([this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist,this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist,this.mainPlayList]); this.playList_9C867BB3_8AE1_766E_41A2_3EDDEBE1A27C.set('selectedIndex', 0); if(!this.get('fullscreenAvailable')) { [this.IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A].forEach(function(component) { component.set('visible', false); }) }",
 "scrollBarWidth": 10,
 "overflow": "visible",
 "paddingRight": 0,
 "borderSize": 0,
 "borderRadius": 0,
 "paddingLeft": 0,
 "height": "100%",
 "definitions": [{
 "label": "Male Toilet Zone",
 "id": "panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A34748CB_8A21_334D_41CD_9CE1E9F21EC5",
  "this.overlay_A0828153_8A21_D55E_41DD_16E12BBEE23D"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 174.4,
   "panorama": "this.panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7",
   "yaw": -140.26,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 94.88,
   "panorama": "this.panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC",
   "yaw": -100.06,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 1184.29,
   "angle": 89.21,
   "y": 759.11,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "label": "Male Toilet",
 "id": "panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A052B264_8A21_377A_41DF_308BAC7E81EC",
  "this.overlay_A0CFE76E_8A21_DD47_41D5_8FA9A35166B6",
  "this.overlay_A0C43936_8A20_D2C6_41DF_0076F9BA2A7C"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 82.7,
   "panorama": "this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897",
   "yaw": -128.45,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -91.52,
   "panorama": "this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5",
   "yaw": -85.24,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -1.59,
   "panorama": "this.panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC",
   "yaw": 26.8,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 1514.54,
   "angle": -94.83,
   "y": 513.53,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "MapPlayListItem",
   "media": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'constrained')",
   "player": "this.MapViewerMapPlayer"
  }
 ],
 "id": "playList_9C867BB3_8AE1_766E_41A2_3EDDEBE1A27C"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C0D4C60_8AE1_72EA_41D5_2DD1D6241E3A",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -162.12,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 88.43,
  "pitch": -5.28
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.7,
  "pitch": -4.77
 },
 "manualZoomSpeed": 0
},
{
 "label": "Female Toilet Zone",
 "id": "panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A37715AD_8A23_3DC5_41A9_1D6556DD107B",
  "this.overlay_A06C69BD_8A23_55CA_41A6_B28F6A077CB4"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -89.26,
   "panorama": "this.panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B",
   "yaw": -96.8,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 86.34,
   "panorama": "this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75",
   "yaw": 17.88,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 86.34,
   "panorama": "this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75",
   "yaw": -96.8,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 694.58,
   "angle": 88.64,
   "y": 1647.1,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "class": "SlideInEffect",
 "easing": "linear",
 "id": "effect_F2103674_E554_F572_41B1_203ED4CE50E6",
 "from": "right",
 "duration": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E240D15_8AE1_722A_41DF_8A1156C3F662",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -5.6,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 89.43,
  "pitch": -7.03
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9DFF4C71_8AE1_72EA_41C6_77DBA96F671D",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -69.42,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "label": "Floor Plan 3D",
 "id": "map_98550360_8A21_57EC_41DA_DFA17C291EC7",
 "fieldOfViewOverlayOutsideOpacity": 0,
 "width": 2599,
 "fieldOfViewOverlayRadiusScale": 0.3,
 "maximumZoomFactor": 1.2,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "class": "ImageResourceLevel",
    "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7.jpeg",
    "width": 2599,
    "height": 2147
   },
   {
    "class": "ImageResourceLevel",
    "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_lq.jpeg",
    "width": 281,
    "tags": "preload",
    "height": 233
   }
  ]
 },
 "thumbnailUrl": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_t.jpg",
 "class": "Map",
 "initialZoomFactor": 1,
 "overlays": [
  "this.overlay_998B9664_8A23_51F5_41DB_5AA09CBC457C",
  "this.overlay_99AE7FB0_8A21_2F6D_41B2_254E149A6BE8",
  "this.overlay_9887C6B9_8A21_715F_419A_A83F8C9EB8B6",
  "this.overlay_98CAA389_8A21_373C_41D3_CE79521A4146",
  "this.overlay_991CBDB7_8A20_D354_41DB_8683E9F42DF0",
  "this.overlay_9985A6F3_8A20_DED3_41DB_DA9B9C1AE589",
  "this.overlay_9841BA09_8A2F_513F_41D3_BE1C53A9E38E",
  "this.overlay_997F3B93_8A2F_D72C_41A4_AB84E39821A9",
  "this.overlay_980C42B4_8A2F_D154_41B1_88E0D18B2172",
  "this.overlay_991D2F33_8A20_EF6C_41DF_740C92D91110",
  "this.overlay_9C148ECC_8A27_513B_41DB_5F52A49DBB72"
 ],
 "fieldOfViewOverlayInsideOpacity": 0.4,
 "scaleMode": "fit_inside",
 "fieldOfViewOverlayInsideColor": "#FFFFFF",
 "minimumZoomFactor": 0.5,
 "fieldOfViewOverlayOutsideColor": "#000000",
 "height": 2147
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 100.49,
  "pitch": -4.02
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 93.2,
  "pitch": -3.52
 },
 "manualZoomSpeed": 0
},
{
 "buttonZoomOut": "this.IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE",
 "buttonZoomIn": "this.IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525",
 "class": "MapPlayer",
 "id": "MapViewerMapPlayer",
 "viewerArea": "this.MapViewer",
 "movementMode": "constrained"
},
{
 "label": "Male Toilet Zone",
 "id": "panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A0867E8B_8A2F_6FCD_41D3_29E3DAFA5D63",
  "this.overlay_A0FAB5BF_8A2F_3DC6_41D8_9712CDA01A0B",
  "this.overlay_A0CDB4C6_8A2F_7346_41D9_EB736CB66C2F"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -100.06,
   "panorama": "this.panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66",
   "yaw": 94.88,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7"
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 26.8,
   "panorama": "this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08",
   "yaw": -1.59,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 1186.82,
   "angle": 93.58,
   "y": 515.71,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E191D46_8AE1_7236_41C3_A1D16E2152E9",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -4.22,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E2E6D24_8AE1_726A_417D_9C3B17403A6F",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -85.12,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E166D37_8AE1_7256_41E0_C378B99E639A",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 83.2,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "class": "SlideInEffect",
 "easing": "linear",
 "id": "effect_2745EDF7_ACED_1161_41CE_8D7449621D35",
 "from": "right",
 "duration": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 90.19,
  "pitch": -5.28
 },
 "manualZoomSpeed": 0
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "MapPlayListItem",
   "media": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'constrained')",
   "player": "this.MapViewerMapPlayer"
  }
 ],
 "id": "playList_9C87BBB4_8AE1_766A_41D7_99F2BF8795EF"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E310CE8_8AE1_73FA_41D3_FA513D987D97",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 115.61,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "class": "SlideOutEffect",
 "to": "right",
 "easing": "linear",
 "id": "effect_F210C674_E554_F572_41E1_4BD5DFC260E8",
 "duration": 0
},
{
 "class": "PlayList",
 "items": [
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 0, 1)",
   "media": "this.panorama_8148C872_8A1A_0523_41DF_8658E34FCA66",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 1, 2)",
   "media": "this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 2, 3)",
   "media": "this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 3, 4)",
   "media": "this.panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 4, 5)",
   "media": "this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 5, 6)",
   "media": "this.panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 6, 7)",
   "media": "this.panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 7, 8)",
   "media": "this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 8, 9)",
   "media": "this.panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 9, 10)",
   "media": "this.panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist, 10, 0)",
   "media": "this.panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_camera"
  }
 ],
 "id": "DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E49FCC7_8AE1_7236_41DC_1BB6B6B23E85",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 88.48,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C5D0C00_8AE1_722A_41BD_AF3A0797BE78",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.76,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "label": "Male Toilet Zone",
 "id": "panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A348F33B_8A21_76CE_41CC_41F1AC9CB7B9"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -140.26,
   "panorama": "this.panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66",
   "yaw": 174.4,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 489.65,
   "angle": -87.66,
   "y": 525.6,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "label": "Entrance (2)",
 "id": "panorama_802004A0_8A1A_0DDE_41CD_39D980509897",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A326877F_8A21_5D40_417E_DD26C838459D",
  "this.overlay_A61A7395_8A23_35C5_41CF_E320004CF674",
  "this.overlay_A0D465BA_8A20_FDCE_41D1_7A8E85E2F073"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -64.39,
   "panorama": "this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5",
   "yaw": -85.49,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 92.87,
   "panorama": "this.panorama_8148C872_8A1A_0523_41DF_8658E34FCA66",
   "yaw": 175.78,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -128.45,
   "panorama": "this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08",
   "yaw": 82.7,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 1497.78,
   "angle": -86.55,
   "y": 998.3,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "label": "Entrance",
 "id": "panorama_8148C872_8A1A_0523_41DF_8658E34FCA66",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A36E7799_8AE7_5DF8_41A3_7C70A3253333"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 175.78,
   "panorama": "this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897",
   "yaw": 92.87,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 2137.05,
   "angle": 167.92,
   "y": 994.56,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E4CACD8_8AE1_73DA_41D1_3E7D7B8AB8EA",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 178.41,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "label": "Female Toilet Zone",
 "id": "panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A08A63F2_8A21_555E_41C0_182FA97C6AE4",
  "this.overlay_A0941362_8A20_F57E_41D9_863713D8EA2E"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 17.88,
   "panorama": "this.panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971",
   "yaw": 86.34,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 110.58,
   "panorama": "this.panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B",
   "yaw": -60.12,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 1169.7,
   "angle": 179.05,
   "y": 1662.42,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "class": "SlideOutEffect",
 "to": "right",
 "easing": "linear",
 "id": "effect_2745FDF7_ACED_1161_41D1_B5EC4D857875",
 "duration": 0
},
{
 "label": "Female Toilet Zone",
 "id": "panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A0793F8D_8A23_2DCA_41C8_A9102157C3E0"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -96.8,
   "panorama": "this.panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971",
   "yaw": -89.26,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 610.15,
   "angle": -90.87,
   "y": 1437.47,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 91.44,
  "pitch": -6.78
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C21EC32_8AE1_726E_41DD_C695AFE86055",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 90.74,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "label": "Female Toilet",
 "id": "panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A1FF017D_8A20_F545_41AE_02E5FF4FBB84",
  "this.overlay_A379406A_8A27_334F_41D6_DA18DA8C5699",
  "this.overlay_A3405F74_8A27_6D5A_41D9_01EDF9562A31"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -85.49,
   "panorama": "this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897",
   "yaw": -64.39,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -85.24,
   "panorama": "this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08",
   "yaw": -91.52,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 178.37,
   "panorama": "this.panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B",
   "yaw": 89.61,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 1499.47,
   "angle": 90.83,
   "y": 1396.7,
   "class": "PanoramaMapLocation"
  },
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 1499.47,
   "angle": 0,
   "y": 1396.7,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E04FD54_8AE1_722A_41DE_F652CCD6320A",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -90.39,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "class": "PlayList",
 "items": [
  {
   "begin": "this.setEndToItemIndex(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist, 0, 1)",
   "media": "this.panorama_8148C872_8A1A_0523_41DF_8658E34FCA66",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist, 1, 2)",
   "media": "this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_camera"
  },
  {
   "begin": "this.setEndToItemIndex(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist, 2, 0)",
   "media": "this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08",
   "class": "PanoramaPlayListItem",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_camera"
  }
 ],
 "id": "ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E0D3D63_8AE1_72EE_4197_47B0D29E7F73",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 119.88,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C571BF0_8AE1_75EA_41D9_BB91976CA39E",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.51,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 90.69,
  "pitch": -4.27
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_802004A0_8A1A_0DDE_41CD_39D980509897_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "buttonMoveRight": "this.IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE",
 "mouseControlMode": "drag_acceleration",
 "buttonPlayLeft": "this.IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF",
 "displayPlaybackBar": true,
 "buttonMoveUp": "this.IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB",
 "buttonPlayRight": "this.IconButton_A7979343_B17D_3EDA_41BB_92702E290118",
 "id": "MainViewerPanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "touchControlMode": "drag_rotation",
 "buttonZoomOut": "this.IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE",
 "gyroscopeVerticalDraggingEnabled": true,
 "buttonMoveDown": "this.IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96",
 "class": "PanoramaPlayer",
 "buttonMoveLeft": "this.IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935",
 "buttonPause": "this.IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61",
 "buttonZoomIn": "this.IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C69ABE1_8AE1_75EA_41DC_ACB9AD3091F5",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -153.2,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E3A0CF7_8AE1_73D6_4191_59CFFE622FA1",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -87.13,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C02EC50_8AE1_722A_41BD_457EB3A00E68",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -93.66,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E454CB8_8AE1_725A_41E0_02954ED9A42F",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -97.3,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "class": "PlayList",
 "items": [
  "this.PanoramaPlayListItem_9C849BB4_8AE1_766A_41D8_3F9B2F4C9E49",
  "this.PanoramaPlayListItem_9C846BB4_8AE1_766A_41DD_80E7F2F80003",
  "this.PanoramaPlayListItem_9C85FBB5_8AE1_766A_41E0_6D4F601140A8",
  "this.PanoramaPlayListItem_9C8A8BB5_8AE1_766A_41D9_979D8DC5C4CE",
  "this.PanoramaPlayListItem_9C8A1BB6_8AE1_7656_41CF_7F0855C8FA15",
  "this.PanoramaPlayListItem_9C8BBBB6_8AE1_7656_4152_12DB21009F9B",
  "this.PanoramaPlayListItem_9C8B6BB6_8AE1_7656_41A8_E72F0627D21B",
  "this.PanoramaPlayListItem_9C88DBB7_8AE1_7656_41DF_E9732C05208F",
  "this.PanoramaPlayListItem_9C898BB7_8AE1_7656_41BA_4A1FD4A655A2",
  "this.PanoramaPlayListItem_9C892BB7_8AE1_7656_41E0_ECDE77248B1D",
  "this.PanoramaPlayListItem_9C8EBBB8_8AE1_765A_4190_D4A98BFC468D"
 ],
 "id": "mainPlayList"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.7,
  "pitch": -6.78
 },
 "manualZoomSpeed": 0
},
{
 "label": "Female Toilet Zone",
 "id": "panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B",
 "vfov": 180,
 "hfovMax": 130,
 "pitch": 0,
 "thumbnailUrl": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_t.jpg",
 "class": "Panorama",
 "frames": [
  {
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/b/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/b/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/b/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/b/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/f/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/f/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/f/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/f/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/u/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/u/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/u/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/u/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/r/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/r/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/r/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/r/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_t.jpg",
   "class": "CubicPanoramaFrame",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/d/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/d/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/d/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/d/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/l/0/{row}_{column}.jpg",
      "width": 3072,
      "tags": "ondemand",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/l/1/{row}_{column}.jpg",
      "width": 1536,
      "tags": "ondemand",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/l/2/{row}_{column}.jpg",
      "width": 1024,
      "tags": "ondemand",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0/l/3/{row}_{column}.jpg",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "overlays": [
  "this.overlay_A602BAD6_8A20_F746_41E0_2EED14BD4F00",
  "this.overlay_A00C17B5_8A21_3DDA_41D7_68C4216935BD"
 ],
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "backwardYaw": 89.61,
   "panorama": "this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5",
   "yaw": 178.37,
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "backwardYaw": -60.12,
   "panorama": "this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75",
   "yaw": 110.58,
   "distance": 1
  }
 ],
 "mapLocations": [
  {
   "map": "this.map_98550360_8A21_57EC_41DA_DFA17C291EC7",
   "x": 1497.78,
   "angle": -178.55,
   "y": 1755.66,
   "class": "PanoramaMapLocation"
  }
 ],
 "hfov": 360,
 "partial": false
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C614BD1_8AE1_762A_41D9_683618ADBE81",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 79.94,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C10BC41_8AE1_722A_41D5_CECE9A71D33C",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -93.66,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C491C10_8AE1_722A_41DB_72CF08A37005",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -1.63,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9C34FC22_8AE1_726E_41B8_5E25642F0174",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 39.74,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_camera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 93.45,
  "pitch": -3.27
 },
 "manualZoomSpeed": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323,
    "yawSpeed": 7.96
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "yawSpeed": 7.96
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "automaticRotationSpeed": 12,
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 0,
 "id": "camera_9E3DBD06_8AE1_7236_41D4_D8BB98FF2CB1",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 51.55,
  "pitch": 0
 },
 "manualZoomSpeed": 0
},
{
 "toolTipPaddingBottom": 4,
 "toolTipTextShadowBlurRadius": 3,
 "id": "MainViewer",
 "paddingBottom": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipFontWeight": "normal",
 "toolTipShadowColor": "#333333",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "width": "100%",
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 0,
 "progressBarBorderRadius": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarBorderRadius": 0,
 "paddingLeft": 0,
 "height": "100%",
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "minHeight": 50,
 "toolTipFontFamily": "Arial",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderRadius": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "playbackBarBorderSize": 0,
 "propagateClick": true,
 "toolTipShadowVerticalLength": 0,
 "minWidth": 100,
 "playbackBarBackgroundOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontColor": "#606060",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "toolTipBackgroundColor": "#F6F6F6",
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "vrPointerSelectionTime": 2000,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "shadow": false,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 6,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipBorderSize": 1,
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "vrPointerColor": "#FFFFFF",
 "toolTipDisplayTime": 600,
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "paddingRight": 0,
 "borderSize": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "class": "ViewerArea",
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarBottom": 5,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "playbackBarHeadOpacity": 1,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontSize": "0.6vw",
 "progressBorderColor": "#000000",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Main Viewer"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "Image_BEE6FED8_AC35_2F20_41D8_34B6B91DA709",
 "left": "3%",
 "paddingBottom": 0,
 "shadow": false,
 "right": "91.27%",
 "url": "skin/Image_BEE6FED8_AC35_2F20_41D8_34B6B91DA709.png",
 "maxWidth": 214,
 "maxHeight": 85,
 "backgroundOpacity": 0,
 "top": "86.71%",
 "paddingRight": 0,
 "borderSize": 0,
 "borderRadius": 0,
 "paddingLeft": 0,
 "bottom": "4%",
 "minHeight": 1,
 "propagateClick": false,
 "class": "Image",
 "minWidth": 1,
 "verticalAlign": "middle",
 "scaleMode": "fit_inside",
 "data": {
  "name": "DD"
 },
 "paddingTop": 0
},
{
 "gap": 10,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.Container_F59EA3FC_AC15_152A_41D3_A68AE3523ABE",
  "this.Container_8F88A174_B17F_DAF3_41E3_9385916D5A3E",
  "this.Container_8E56560D_B147_6613_41E3_B9F30B1AF2C2"
 ],
 "id": "Container_806973DA_ADB0_EB72_41E1_4BBDAAEB91FF",
 "left": "79.38%",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "vertical",
 "right": "1.2%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "top": "0%",
 "paddingRight": 0,
 "borderSize": 0,
 "height": "100%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "propagateClick": false,
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarColor": "#000000",
 "contentOpaque": false,
 "data": {
  "name": "Right Side Container"
 },
 "paddingTop": 0
},
{
 "gap": 10,
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856"
 ],
 "id": "Container_BC8D06B7_B143_E72C_41CA_E1C4F81682F0",
 "left": "0%",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "absolute",
 "right": "84.23%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "top": "0%",
 "paddingRight": 0,
 "borderSize": 0,
 "borderRadius": 0,
 "paddingLeft": 0,
 "bottom": "0%",
 "minHeight": 1,
 "propagateClick": false,
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "verticalAlign": "top",
 "minWidth": 1,
 "contentOpaque": false,
 "paddingTop": 0,
 "data": {
  "name": "Left Side Container"
 }
},
{
 "scrollBarVisible": "rollOver",
 "id": "HTMLText_B3A95BF7_AD90_5B11_41E1_AC9050095132",
 "left": "0.05%",
 "paddingBottom": 20,
 "shadow": false,
 "right": "49.95%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "top": "0%",
 "paddingRight": 20,
 "borderSize": 0,
 "borderRadius": 0,
 "paddingLeft": 20,
 "bottom": "87.72%",
 "minHeight": 1,
 "propagateClick": false,
 "class": "HTMLText",
 "scrollBarOpacity": 0.5,
 "minWidth": 1,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vw;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:1.99vw;\"><B>Public Toilet</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vw;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#003366;font-size:1.69vw;\"><B><I>Core Service</I></B></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText53815"
 },
 "paddingTop": 20
},
{
 "gap": 4,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE",
  "this.IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF",
  "this.IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935",
  "this.Container_A7977343_B17D_3EDA_41C0_F47328C07981",
  "this.IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE",
  "this.IconButton_A7979343_B17D_3EDA_41BB_92702E290118",
  "this.IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A",
  "this.IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525"
 ],
 "id": "Container_A797E343_B17D_3EDA_41AB_2CDE4A57AE7C",
 "left": "40%",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "horizontal",
 "right": "38.77%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "overflow": "hidden",
 "top": "85.03%",
 "paddingRight": 0,
 "borderSize": 0,
 "borderRadius": 0,
 "paddingLeft": 0,
 "bottom": "0%",
 "minHeight": 20,
 "propagateClick": false,
 "class": "Container",
 "scrollBarOpacity": 0.5,
 "minWidth": 20,
 "verticalAlign": "middle",
 "scrollBarColor": "#000000",
 "contentOpaque": false,
 "data": {
  "name": "Middle Control"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "toolTipTextShadowBlurRadius": 3,
 "id": "IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A",
 "paddingBottom": 0,
 "shadow": false,
 "toolTipFontWeight": "normal",
 "toolTipShadowColor": "#333333",
 "width": "15.34%",
 "toolTipShadowHorizontalLength": 0,
 "toolTipPaddingRight": 6,
 "maxWidth": 128,
 "toolTipBorderSize": 1,
 "pressedIconURL": "skin/IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A_pressed.png",
 "maxHeight": 128,
 "toolTipPaddingTop": 4,
 "backgroundOpacity": 0,
 "toolTipDisplayTime": 600,
 "toolTipPaddingLeft": 6,
 "rollOverIconURL": "skin/IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A_rollover.png",
 "paddingRight": 0,
 "toolTipShadowOpacity": 1,
 "borderSize": 0,
 "transparencyActive": true,
 "height": "27.74%",
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "toggle",
 "toolTipFontStyle": "normal",
 "minHeight": 1,
 "toolTipFontFamily": "Arial",
 "toolTip": "Fullscreen",
 "class": "IconButton",
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "toolTipShadowVerticalLength": 0,
 "iconURL": "skin/IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A.png",
 "toolTipBorderColor": "#767676",
 "minWidth": 1,
 "verticalAlign": "middle",
 "toolTipFontColor": "#606060",
 "toolTipShadowBlurRadius": 3,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipOpacity": 1,
 "toolTipShadowSpread": 0,
 "toolTipFontSize": 12,
 "toolTipTextShadowColor": "#000000",
 "cursor": "hand",
 "toolTipPaddingBottom": 4,
 "data": {
  "name": "IconButton1493"
 },
 "paddingTop": 0
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b Left-Up"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -140.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0_HS_2_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -39.88,
   "hfov": 13.57
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_A17237F7_8A21_DD45_41E0_8333A3BD0714",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -140.26,
   "pitch": -39.88,
   "hfov": 13.57,
   "distance": 100
  }
 ],
 "id": "overlay_A34748CB_8A21_334D_41CD_9CE1E9F21EC5",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7, this.camera_9E240D15_8AE1_722A_41DF_8A1156C3F662); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -100.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0_HS_3_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -49.43,
   "hfov": 18.69
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A588C4_8A23_53B4_41AE_AB97AB8DBE22",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -100.06,
   "pitch": -49.43,
   "hfov": 18.69,
   "distance": 100
  }
 ],
 "id": "overlay_A0828153_8A21_D55E_41DD_16E12BBEE23D",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC, this.camera_9E2E6D24_8AE1_726A_417D_9C3B17403A6F); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -85.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0_HS_3_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -26.06,
   "hfov": 14.08
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A3A8C3_8A23_53AC_41D8_9BD3660B0710",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -85.24,
   "pitch": -26.06,
   "hfov": 14.08,
   "distance": 100
  }
 ],
 "id": "overlay_A052B264_8A21_377A_41DF_308BAC7E81EC",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5, this.camera_9E49FCC7_8AE1_7236_41DC_1BB6B6B23E85); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c Left-Up"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -128.45,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0_HS_4_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -41.64,
   "hfov": 10.21
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A278C3_8A23_53AC_41CA_1C3F5936BFBE",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -128.45,
   "pitch": -41.64,
   "hfov": 10.21,
   "distance": 100
  }
 ],
 "id": "overlay_A0CFE76E_8A21_DD47_41D5_8FA9A35166B6",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897, this.camera_9E454CB8_8AE1_725A_41E0_02954ED9A42F); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c Left-Up"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 26.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0_HS_5_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -32.85,
   "hfov": 12.74
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A208C3_8A23_53AC_41A2_A7910FAE31C3",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 26.8,
   "pitch": -32.85,
   "hfov": 12.74,
   "distance": 100
  }
 ],
 "id": "overlay_A0C43936_8A20_D2C6_41DF_0076F9BA2A7C",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC, this.camera_9E4CACD8_8AE1_73DA_41D1_3E7D7B8AB8EA); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 17.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0_HS_2_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -34.35,
   "hfov": 9
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A0D8C2_8A23_53AC_41DC_A933CE6104A3",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 17.88,
   "pitch": -34.35,
   "hfov": 9,
   "distance": 100
  }
 ],
 "id": "overlay_A37715AD_8A23_3DC5_41A9_1D6556DD107B",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75, this.camera_9C10BC41_8AE1_722A_41D5_CECE9A71D33C); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -96.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0_HS_3_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -54.7,
   "hfov": 15.44
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A098C3_8A23_53AC_41A5_69C35E1AC75A",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -96.8,
   "pitch": -54.7,
   "hfov": 15.44,
   "distance": 100
  }
 ],
 "id": "overlay_A06C69BD_8A23_55CA_41A6_B28F6A077CB4",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75, this.camera_9C02EC50_8AE1_722A_41BD_457EB3A00E68); this.mainPlayList.set('selectedIndex', 4); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 2087.47,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_0_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 944.82,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 2087.05,
  "y": 944.56,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_0.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_998B9664_8A23_51F5_41DB_5AA09CBC457C",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 1448.26,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_1_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 948.77,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 1447.78,
  "y": 948.3,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_1.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_99AE7FB0_8A21_2F6D_41B2_254E149A6BE8",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 1448.26,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_2_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 1706.09,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 1447.78,
  "y": 1705.66,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_2.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_9887C6B9_8A21_715F_419A_A83F8C9EB8B6",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 1119.9,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_3_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 1612.62,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 1119.7,
  "y": 1612.42,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_3.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_98CAA389_8A21_373C_41D3_CE79521A4146",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 644.86,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_4_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 1597.58,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 644.58,
  "y": 1597.1,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_4.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_991CBDB7_8A20_D354_41DB_8683E9F42DF0",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 1464.99,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_5_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 463.76,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 1464.54,
  "y": 463.53,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_5.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_9985A6F3_8A20_DED3_41DB_DA9B9C1AE589",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 560.42,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_6_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 1387.7,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 560.15,
  "y": 1387.47,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_6.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_9841BA09_8A2F_513F_41D3_BE1C53A9E38E",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 1137.02,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_7_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 466.01,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 1136.82,
  "y": 465.71,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_7.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_997F3B93_8A2F_D72C_41A4_AB84E39821A9",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 1134.57,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_8_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 709.55,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 1134.29,
  "y": 709.11,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_8.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_980C42B4_8A2F_D154_41B1_88E0D18B2172",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 439.87,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_9_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 475.79,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 439.65,
  "y": 475.6,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_9.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_991D2F33_8A20_EF6C_41DF_740C92D91110",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "map": {
  "width": 100,
  "x": 1449.95,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_10_map.gif",
     "width": 16,
     "height": 16
    }
   ]
  },
  "y": 1346.89,
  "class": "HotspotMapOverlayMap",
  "offsetY": 0,
  "height": 100,
  "offsetX": 0
 },
 "data": {
  "label": "Image"
 },
 "image": {
  "x": 1449.47,
  "y": 1346.7,
  "width": 100,
  "image": {
   "class": "ImageResource",
   "levels": [
    {
     "class": "ImageResourceLevel",
     "url": "media/map_98550360_8A21_57EC_41DA_DFA17C291EC7_HS_10.png",
     "width": 99,
     "height": 99
    }
   ]
  },
  "class": "HotspotMapOverlayImage",
  "height": 100
 },
 "class": "AreaHotspotMapOverlay",
 "id": "overlay_9C148ECC_8A27_513B_41DB_5F52A49DBB72",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotMapOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE",
 "paddingBottom": 0,
 "shadow": false,
 "width": "9.07%",
 "pressedIconURL": "skin/IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 0,
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27662"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525",
 "paddingBottom": 0,
 "shadow": false,
 "width": "8.91%",
 "pressedIconURL": "skin/IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 0,
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27673"
 },
 "paddingTop": 0
},
{
 "toolTipPaddingBottom": 4,
 "toolTipTextShadowBlurRadius": 3,
 "id": "MapViewer",
 "paddingBottom": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipFontWeight": "normal",
 "toolTipShadowColor": "#333333",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "width": "100%",
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "transitionDuration": 500,
 "progressBarBorderRadius": 0,
 "toolTipShadowOpacity": 1,
 "playbackBarBorderRadius": 0,
 "paddingLeft": 0,
 "height": "90%",
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "minHeight": 1,
 "toolTipFontFamily": "Arial",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderRadius": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipShadowVerticalLength": 0,
 "minWidth": 1,
 "playbackBarBackgroundOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "toolTipFontColor": "#606060",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "toolTipBackgroundColor": "#F6F6F6",
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "vrPointerSelectionTime": 2000,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 2,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "shadow": false,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 6,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipBorderSize": 1,
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "vrPointerColor": "#FFFFFF",
 "toolTipDisplayTime": 600,
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "paddingRight": 0,
 "borderSize": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderSize": 0,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "transitionMode": "blending",
 "progressBorderRadius": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "class": "ViewerArea",
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarBottom": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "playbackBarHeadOpacity": 1,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontSize": "1.11vmin",
 "progressBorderColor": "#000000",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Floor Plan"
 },
 "paddingTop": 0
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -1.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0_HS_3_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -47.42,
   "hfov": 16.38
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A2A8C3_8A23_53AC_41CB_93BB3F3155FE",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -1.59,
   "pitch": -47.42,
   "hfov": 16.38,
   "distance": 100
  }
 ],
 "id": "overlay_A0867E8B_8A2F_6FCD_41D3_29E3DAFA5D63",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08, this.camera_9C69ABE1_8AE1_75EA_41DC_ACB9AD3091F5); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 94.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0_HS_4_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -54.45,
   "hfov": 14.66
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_A17287F6_8A21_DD47_418F_32BBEC646E8A",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 94.88,
   "pitch": -54.45,
   "hfov": 14.66,
   "distance": 100
  }
 ],
 "id": "overlay_A0FAB5BF_8A2F_3DC6_41D8_9712CDA01A0B",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66, this.camera_9C614BD1_8AE1_762A_41D9_683618ADBE81); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c Right-Up"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -179.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0_HS_5_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -34.22,
   "hfov": 14.96
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A538C3_8A23_53AC_41D8_0F6699C9DCB6",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -179.25,
   "pitch": -34.22,
   "hfov": 14.96,
   "distance": 100
  }
 ],
 "id": "overlay_A0CDB4C6_8A2F_7346_41D9_EB736CB66C2F",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b Left-Up"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 174.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0_HS_1_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -29.2,
   "hfov": 19.6
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A428C4_8A23_53B4_41D2_033722830907",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 174.4,
   "pitch": -29.2,
   "hfov": 19.6,
   "distance": 100
  }
 ],
 "id": "overlay_A348F33B_8A21_76CE_41CC_41F1AC9CB7B9",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66, this.camera_9C34FC22_8AE1_726E_41B8_5E25642F0174); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 175.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0_HS_6_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -35.11,
   "hfov": 23.51
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3BFE8C0_8A23_53AC_41D1_78E9D9717A8D",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 175.78,
   "pitch": -35.11,
   "hfov": 23.51,
   "distance": 100
  }
 ],
 "id": "overlay_A326877F_8A21_5D40_417E_DD26C838459D",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_8148C872_8A1A_0523_41DF_8658E34FCA66, this.camera_9E3A0CF7_8AE1_73D6_4191_59CFFE622FA1); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 82.7,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0_HS_9_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -40.76,
   "hfov": 14.72
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_BE32774F_8A21_5EB4_41C7_57FDBDED9C29",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 82.7,
   "pitch": -40.76,
   "hfov": 14.72,
   "distance": 100
  }
 ],
 "id": "overlay_A61A7395_8A23_35C5_41CF_E320004CF674",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08, this.camera_9E3DBD06_8AE1_7236_41D4_D8BB98FF2CB1); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -85.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0_HS_10_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -35.36,
   "hfov": 13.19
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_A179B7F4_8A21_DD5B_41C1_3AF0736FC21B",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -85.49,
   "pitch": -35.36,
   "hfov": 13.19,
   "distance": 100
  }
 ],
 "id": "overlay_A0D465BA_8A20_FDCE_41D1_7A8E85E2F073",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5, this.camera_9E310CE8_8AE1_73FA_41D3_FA513D987D97); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 92.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0_HS_2_0_0_map.gif",
      "width": 28,
      "height": 16
     }
    ]
   },
   "pitch": -42.64,
   "hfov": 13.01
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_A5D8C083_8AE1_D3C8_418F_C182F35850FD",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 92.87,
   "pitch": -42.64,
   "hfov": 13.01,
   "distance": 100
  }
 ],
 "id": "overlay_A36E7799_8AE7_5DF8_41A3_7C70A3253333",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897, this.camera_9E191D46_8AE1_7236_41C3_A1D16E2152E9); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 86.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0_HS_2_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -31.34,
   "hfov": 11.67
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A048C2_8A23_53AC_41A3_4E93A6B8C976",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 86.34,
   "pitch": -31.34,
   "hfov": 11.67,
   "distance": 100
  }
 ],
 "id": "overlay_A08A63F2_8A21_555E_41C0_182FA97C6AE4",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971, this.camera_9C0D4C60_8AE1_72EA_41D5_2DD1D6241E3A); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c Left-Up"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -60.12,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0_HS_3_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -49.55,
   "hfov": 9.51
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_A17FF7F5_8A21_DD45_41C2_8892C6571B24",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -60.12,
   "pitch": -49.55,
   "hfov": 9.51,
   "distance": 100
  }
 ],
 "id": "overlay_A0941362_8A20_F57E_41D9_863713D8EA2E",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B, this.camera_9DFF4C71_8AE1_72EA_41C6_77DBA96F671D); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -89.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0_HS_1_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -51.69,
   "hfov": 17.81
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3A308C3_8A23_53AC_41D2_A74DF83B35CB",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -89.26,
   "pitch": -51.69,
   "hfov": 17.81,
   "distance": 100
  }
 ],
 "id": "overlay_A0793F8D_8A23_2DCA_41C8_A9102157C3E0",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971, this.camera_9E166D37_8AE1_7256_41E0_C378B99E639A); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 89.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0_HS_3_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -41.39,
   "hfov": 9.49
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_BE32874F_8A21_5EB4_41CD_C15BB922163F",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 89.61,
   "pitch": -41.39,
   "hfov": 9.49,
   "distance": 100
  }
 ],
 "id": "overlay_A1FF017D_8A20_F545_41AE_02E5FF4FBB84",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B, this.camera_9C491C10_8AE1_722A_41DB_72CF08A37005); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c Right-Up"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -64.39,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0_HS_4_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -39.88,
   "hfov": 16.65
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B3BEC8C0_8A23_53AC_41D9_0C31A4237B17",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -64.39,
   "pitch": -39.88,
   "hfov": 16.65,
   "distance": 100
  }
 ],
 "id": "overlay_A379406A_8A27_334F_41D6_DA18DA8C5699",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897, this.camera_9C571BF0_8AE1_75EA_41D9_BB91976CA39E); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -91.52,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0_HS_5_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -26.82,
   "hfov": 10.85
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_BE331750_8A21_5EAC_4162_C6B6AA5228AC",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -91.52,
   "pitch": -26.82,
   "hfov": 10.85,
   "distance": 100
  }
 ],
 "id": "overlay_A3405F74_8A27_6D5A_41D9_01EDF9562A31",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08, this.camera_9C5D0C00_8AE1_722A_41BD_AF3A0797BE78); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE",
 "paddingBottom": 0,
 "shadow": false,
 "width": "8.96%",
 "pressedIconURL": "skin/IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 0,
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27670"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF",
 "paddingBottom": 0,
 "shadow": false,
 "width": "11.27%",
 "pressedIconURL": "skin/IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "29.2%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 0,
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27664"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB",
 "paddingBottom": 0,
 "shadow": false,
 "width": "80%",
 "pressedIconURL": "skin/IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 0,
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27667"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7979343_B17D_3EDA_41BB_92702E290118",
 "paddingBottom": 0,
 "shadow": false,
 "width": "11.17%",
 "pressedIconURL": "skin/IconButton_A7979343_B17D_3EDA_41BB_92702E290118_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_A7979343_B17D_3EDA_41BB_92702E290118_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "29.2%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 0,
 "pressedRollOverIconURL": "skin/IconButton_A7979343_B17D_3EDA_41BB_92702E290118_pressed_rollover.png",
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7979343_B17D_3EDA_41BB_92702E290118.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27671"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96",
 "paddingBottom": 0,
 "shadow": false,
 "width": "80%",
 "pressedIconURL": "skin/IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 0,
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27669"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935",
 "paddingBottom": 0,
 "shadow": false,
 "width": "8.99%",
 "pressedIconURL": "skin/IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 0,
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27665"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61",
 "paddingBottom": 0,
 "shadow": false,
 "width": "100%",
 "pressedIconURL": "skin/IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "29.2%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "toggle",
 "minHeight": 0,
 "pressedRollOverIconURL": "skin/IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61_pressed_rollover.png",
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27668"
 },
 "paddingTop": 0
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C849BB4_8AE1_766A_41D8_3F9B2F4C9E49, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 0, 1)",
 "media": "this.panorama_8148C872_8A1A_0523_41DF_8658E34FCA66",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C849BB4_8AE1_766A_41D8_3F9B2F4C9E49",
 "camera": "this.panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C846BB4_8AE1_766A_41DD_80E7F2F80003, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 1, 2)",
 "media": "this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C846BB4_8AE1_766A_41DD_80E7F2F80003",
 "camera": "this.panorama_802004A0_8A1A_0DDE_41CD_39D980509897_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C85FBB5_8AE1_766A_41E0_6D4F601140A8, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 2, 3)",
 "media": "this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C85FBB5_8AE1_766A_41E0_6D4F601140A8",
 "camera": "this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C8A8BB5_8AE1_766A_41D9_979D8DC5C4CE, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 3, 4)",
 "media": "this.panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C8A8BB5_8AE1_766A_41D9_979D8DC5C4CE",
 "camera": "this.panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C8A1BB6_8AE1_7656_41CF_7F0855C8FA15, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 4, 5)",
 "media": "this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C8A1BB6_8AE1_7656_41CF_7F0855C8FA15",
 "camera": "this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C8BBBB6_8AE1_7656_4152_12DB21009F9B, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 5, 6)",
 "media": "this.panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C8BBBB6_8AE1_7656_4152_12DB21009F9B",
 "camera": "this.panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C8B6BB6_8AE1_7656_41A8_E72F0627D21B, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 6, 7)",
 "media": "this.panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C8B6BB6_8AE1_7656_41A8_E72F0627D21B",
 "camera": "this.panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C88DBB7_8AE1_7656_41DF_E9732C05208F, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 7, 8)",
 "media": "this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C88DBB7_8AE1_7656_41DF_E9732C05208F",
 "camera": "this.panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C898BB7_8AE1_7656_41BA_4A1FD4A655A2, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 8, 9)",
 "media": "this.panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C898BB7_8AE1_7656_41BA_4A1FD4A655A2",
 "camera": "this.panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C892BB7_8AE1_7656_41E0_ECDE77248B1D, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 9, 10)",
 "media": "this.panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C892BB7_8AE1_7656_41E0_ECDE77248B1D",
 "camera": "this.panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_camera"
},
{
 "begin": "this.setMapLocation(this.PanoramaPlayListItem_9C8EBBB8_8AE1_765A_4190_D4A98BFC468D, this.MapViewerMapPlayer); this.setEndToItemIndex(this.mainPlayList, 10, 0)",
 "media": "this.panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7",
 "end": "this.trigger('tourEnded')",
 "class": "PanoramaPlayListItem",
 "player": "this.MainViewerPanoramaPlayer",
 "id": "PanoramaPlayListItem_9C8EBBB8_8AE1_765A_4190_D4A98BFC468D",
 "camera": "this.panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_camera"
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01c"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 110.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0_HS_2_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -37.24,
   "hfov": 9.47
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B54F95EC_8A20_DD7B_41C8_3E1FCF495D13",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 110.58,
   "pitch": -37.24,
   "hfov": 9.47,
   "distance": 100
  }
 ],
 "id": "overlay_A602BAD6_8A20_F746_41E0_2EED14BD4F00",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75, this.camera_9E0D3D63_8AE1_72EE_4197_47B0D29E7F73); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "useHandCursor": true,
 "enabledInCardboard": true,
 "data": {
  "label": "Circle Arrow 01b Right-Up"
 },
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 178.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "class": "ImageResourceLevel",
      "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0_HS_3_0_0_map.gif",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": -40.76,
   "hfov": 10.85
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "items": [
  {
   "image": "this.AnimatedImageResource_B54FE5EC_8A20_DD7B_41A0_D56DDB4D76E6",
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 178.37,
   "pitch": -40.76,
   "hfov": 10.85,
   "distance": 100
  }
 ],
 "id": "overlay_A00C17B5_8A21_3DDA_41D7_68C4216935BD",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5, this.camera_9E04FD54_8AE1_722A_41DE_F652CCD6320A); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "gap": 15,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.Container_FDD61685_E553_9592_41C0_A2A83A363C32"
 ],
 "id": "Container_F59EA3FC_AC15_152A_41D3_A68AE3523ABE",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "vertical",
 "width": "100%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "paddingRight": 0,
 "borderSize": 2,
 "height": "69.727%",
 "borderRadius": 50,
 "paddingLeft": 0,
 "minHeight": 1,
 "class": "Container",
 "propagateClick": false,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "verticalAlign": "middle",
 "minWidth": 1,
 "contentOpaque": true,
 "data": {
  "name": "Floor Plan Container"
 },
 "paddingTop": 0
},
{
 "gap": 10,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9"
 ],
 "id": "Container_8F88A174_B17F_DAF3_41E3_9385916D5A3E",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "vertical",
 "width": "100%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "paddingRight": 0,
 "borderSize": 0,
 "height": "19.78%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "class": "Container",
 "propagateClick": false,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "verticalAlign": "middle",
 "minWidth": 1,
 "contentOpaque": false,
 "data": {
  "name": "Middle"
 },
 "paddingTop": 0
},
{
 "gap": 10,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.Container_8886944C_AC33_7318_41AB_EB089F4691B5"
 ],
 "id": "Container_8E56560D_B147_6613_41E3_B9F30B1AF2C2",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "vertical",
 "width": "100%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "paddingRight": 0,
 "borderSize": 0,
 "height": "5.25%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "class": "Container",
 "propagateClick": false,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "verticalAlign": "middle",
 "minWidth": 1,
 "contentOpaque": false,
 "data": {
  "name": "Bottom"
 },
 "paddingTop": 0
},
{
 "gap": 5,
 "horizontalAlign": "left",
 "id": "ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856",
 "left": "10%",
 "paddingBottom": 10,
 "itemMode": "normal",
 "itemLabelFontStyle": "normal",
 "right": "25%",
 "itemPaddingBottom": 3,
 "itemLabelHorizontalAlign": "center",
 "scrollBarMargin": 2,
 "itemOpacity": 1,
 "itemLabelPosition": "bottom",
 "itemLabelFontFamily": "Arial",
 "itemThumbnailBorderRadius": 50,
 "itemVerticalAlign": "middle",
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "itemBorderRadius": 0,
 "paddingLeft": 20,
 "itemPaddingLeft": 3,
 "itemThumbnailShadowOpacity": 0.54,
 "minHeight": 20,
 "propagateClick": false,
 "playList": "this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist",
 "itemThumbnailOpacity": 1,
 "itemThumbnailShadowSpread": 1,
 "scrollBarOpacity": 0.5,
 "minWidth": 20,
 "itemPaddingRight": 3,
 "verticalAlign": "top",
 "itemPaddingTop": 3,
 "scrollBarColor": "#FFFFFF",
 "itemBackgroundColor": [],
 "selectedItemLabelFontColor": "#FFCC00",
 "itemLabelGap": 9,
 "itemBackgroundOpacity": 0,
 "itemThumbnailShadowHorizontalLength": 3,
 "scrollBarVisible": "rollOver",
 "rollOverItemLabelFontWeight": "normal",
 "rollOverItemBackgroundOpacity": 0,
 "shadow": false,
 "layout": "vertical",
 "itemThumbnailShadowVerticalLength": 3,
 "itemBackgroundColorRatios": [],
 "selectedItemLabelFontSize": "0.72vw",
 "itemLabelTextDecoration": "none",
 "itemLabelFontWeight": "normal",
 "itemThumbnailShadowBlurRadius": 8,
 "itemThumbnailHeight": 60,
 "top": "12%",
 "paddingRight": 20,
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontSize": "0.84vw",
 "borderRadius": 5,
 "itemThumbnailShadow": true,
 "borderSize": 0,
 "selectedItemLabelFontWeight": "bold",
 "bottom": "10%",
 "itemLabelFontColor": "#FFFFFF",
 "class": "ThumbnailList",
 "itemHorizontalAlign": "center",
 "itemBackgroundColorDirection": "vertical",
 "rollOverItemLabelFontSize": "0.78vw",
 "data": {
  "name": "ThumbnailList35762"
 },
 "itemThumbnailShadowColor": "#000000",
 "paddingTop": 10
},
{
 "gap": 4,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB",
  "this.IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61",
  "this.IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96"
 ],
 "id": "Container_A7977343_B17D_3EDA_41C0_F47328C07981",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "vertical",
 "width": "11.36%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "overflow": "hidden",
 "paddingRight": 0,
 "borderSize": 0,
 "height": "100%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "minHeight": 20,
 "class": "Container",
 "propagateClick": false,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "verticalAlign": "middle",
 "minWidth": 20,
 "contentOpaque": false,
 "data": {
  "name": "Container27666"
 },
 "paddingTop": 0
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_A17237F7_8A21_DD45_41E0_8333A3BD0714",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0_HS_2_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A588C4_8A23_53B4_41AE_AB97AB8DBE22",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_8058F3B3_8A1A_0B22_41DA_E4E574EC2D66_0_HS_3_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A3A8C3_8A23_53AC_41D8_9BD3660B0710",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0_HS_3_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A278C3_8A23_53AC_41CA_1C3F5936BFBE",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0_HS_4_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A208C3_8A23_53AC_41A2_A7910FAE31C3",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805D95EC_8A1A_0F26_41BB_1D58742B3B08_0_HS_5_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A0D8C2_8A23_53AC_41DC_A933CE6104A3",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0_HS_2_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A098C3_8A23_53AC_41A5_69C35E1AC75A",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805FA71C_8A1A_0CE0_41D4_0BB9F3887971_0_HS_3_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A2A8C3_8A23_53AC_41CB_93BB3F3155FE",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0_HS_3_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_A17287F6_8A21_DD47_418F_32BBEC646E8A",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0_HS_4_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A538C3_8A23_53AC_41D8_0F6699C9DCB6",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805965AB_8A1A_0F22_41D9_3C562F964BBC_0_HS_5_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A428C4_8A23_53B4_41D2_033722830907",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805E81B4_8A1A_0726_41BF_D74A0113F3F7_0_HS_1_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3BFE8C0_8A23_53AC_41D1_78E9D9717A8D",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0_HS_6_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_BE32774F_8A21_5EB4_41C7_57FDBDED9C29",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0_HS_9_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_A179B7F4_8A21_DD5B_41C1_3AF0736FC21B",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_802004A0_8A1A_0DDE_41CD_39D980509897_0_HS_10_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_A5D8C083_8AE1_D3C8_418F_C182F35850FD",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_8148C872_8A1A_0523_41DF_8658E34FCA66_0_HS_2_0.png",
   "width": 1080,
   "height": 900
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A048C2_8A23_53AC_41A3_4E93A6B8C976",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0_HS_2_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_A17FF7F5_8A21_DD45_41C2_8892C6571B24",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805A9CD6_8A1A_7D62_41D8_A879A30DCA75_0_HS_3_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3A308C3_8A23_53AC_41D2_A74DF83B35CB",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805FE521_8A1A_0CDE_41B4_D12F5F7A735B_0_HS_1_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_BE32874F_8A21_5EB4_41CD_C15BB922163F",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0_HS_3_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B3BEC8C0_8A23_53AC_41D9_0C31A4237B17",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0_HS_4_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_BE331750_8A21_5EAC_4162_C6B6AA5228AC",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805A73F7_8A1A_0B21_41DA_355B7BF0FDF5_0_HS_5_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B54F95EC_8A20_DD7B_41C8_3E1FCF495D13",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0_HS_2_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "rowCount": 6,
 "frameDuration": 41,
 "id": "AnimatedImageResource_B54FE5EC_8A20_DD7B_41A0_D56DDB4D76E6",
 "frameCount": 24,
 "colCount": 4,
 "class": "AnimatedImageResource",
 "levels": [
  {
   "class": "ImageResourceLevel",
   "url": "media/panorama_805A3E4C_8A1A_1D67_41DE_CEF1D835985B_0_HS_3_0.png",
   "width": 1080,
   "height": 660
  }
 ]
},
{
 "gap": 15,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990",
  "this.MapViewer"
 ],
 "id": "Container_FDD61685_E553_9592_41C0_A2A83A363C32",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "vertical",
 "width": "100%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "paddingRight": 0,
 "borderSize": 2,
 "height": "80%",
 "borderRadius": 50,
 "paddingLeft": 0,
 "minHeight": 1,
 "class": "Container",
 "propagateClick": false,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "verticalAlign": "middle",
 "creationPolicy": "inAdvance",
 "minWidth": 1,
 "visible": false,
 "contentOpaque": true,
 "data": {
  "name": "Floor Plan Con 01"
 },
 "paddingTop": 0
},
{
 "gap": 3,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E",
  "this.Container_23BF7E02_AC1D_72AA_41DA_22E1695AF185"
 ],
 "id": "Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "horizontal",
 "width": "100%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "paddingRight": 0,
 "borderSize": 0,
 "height": "100%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "class": "Container",
 "propagateClick": false,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "verticalAlign": "middle",
 "creationPolicy": "inAdvance",
 "minWidth": 1,
 "visible": false,
 "contentOpaque": false,
 "data": {
  "name": "Contact Us Compo"
 },
 "paddingTop": 0
},
{
 "gap": 5,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829",
  "this.Button_B5551DB1_A8AE_1192_41E0_9815EC3E8FD9",
  "this.Button_BAFF9AB7_AC6D_3778_41DD_EF9D1C21D15E"
 ],
 "id": "Container_8886944C_AC33_7318_41AB_EB089F4691B5",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "horizontal",
 "width": "100%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "paddingRight": 0,
 "borderSize": 0,
 "height": "100%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "class": "Container",
 "propagateClick": false,
 "scrollBarOpacity": 0,
 "scrollBarColor": "#000000",
 "verticalAlign": "middle",
 "minWidth": 1,
 "contentOpaque": false,
 "data": {
  "name": "Button CU and FP"
 },
 "paddingTop": 0
},
{
 "textDecoration": "none",
 "gap": 0,
 "data": {
  "name": "DropDown1204"
 },
 "popUpShadowColor": "#000000",
 "backgroundColorDirection": "vertical",
 "id": "DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990",
 "rollOverPopUpFontColor": "#FFFFFF",
 "paddingBottom": 0,
 "shadow": false,
 "fontFamily": "Arial",
 "popUpGap": 0,
 "pressedRollOverBackgroundColorRatios": [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
 ],
 "rollOverBackgroundColorRatios": [
  0
 ],
 "selectedPopUpBackgroundColor": "#003366",
 "popUpBackgroundColor": "#FFFFFF",
 "fontColor": "#FFFFFF",
 "width": "100%",
 "pressedRollOverBackgroundColor": [
  "#003366",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#003366"
 ],
 "popUpBackgroundOpacity": 0.2,
 "borderColor": "#FFFFFF",
 "backgroundOpacity": 0.2,
 "popUpShadow": false,
 "paddingRight": 15,
 "borderSize": 2,
 "backgroundColor": [
  "#000000"
 ],
 "popUpFontColor": "#000000",
 "borderRadius": 4,
 "paddingLeft": 15,
 "height": "8%",
 "rollOverPopUpBackgroundColor": "#003366",
 "fontSize": "1vw",
 "arrowColor": "#FFFFFF",
 "minHeight": 20,
 "backgroundColorRatios": [
  0
 ],
 "selectedPopUpFontColor": "#FFFFFF",
 "popUpShadowBlurRadius": 6,
 "class": "DropDown",
 "propagateClick": false,
 "fontStyle": "normal",
 "popUpBorderRadius": 0,
 "popUpShadowSpread": 1,
 "minWidth": 200,
 "playList": "this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist",
 "popUpShadowOpacity": 0,
 "pressedBackgroundColorRatios": [
  0
 ],
 "fontWeight": "bold",
 "rollOverBackgroundColor": [
  "#003366"
 ],
 "pressedBackgroundColor": [
  "#003366"
 ],
 "arrowBeforeLabel": false,
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E",
 "paddingBottom": 0,
 "shadow": false,
 "width": "81.529%",
 "maxWidth": 900,
 "pressedIconURL": "skin/IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E_pressed.png",
 "maxHeight": 616,
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "100%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 1,
 "class": "IconButton",
 "propagateClick": false,
 "click": "if(!this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9.get('visible')){ this.setComponentVisibility(this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9, false, 0, null, null, false) }",
 "iconURL": "skin/IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E.png",
 "minWidth": 1,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Contact"
 },
 "paddingTop": 0
},
{
 "gap": 12,
 "horizontalAlign": "center",
 "scrollBarVisible": "rollOver",
 "children": [
  "this.IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48",
  "this.IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2",
  "this.IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300"
 ],
 "id": "Container_23BF7E02_AC1D_72AA_41DA_22E1695AF185",
 "paddingBottom": 0,
 "shadow": false,
 "layout": "vertical",
 "width": "20%",
 "scrollBarMargin": 2,
 "scrollBarWidth": 10,
 "backgroundOpacity": 0,
 "overflow": "scroll",
 "paddingRight": 0,
 "borderSize": 0,
 "height": "100%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "class": "Container",
 "propagateClick": false,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "verticalAlign": "middle",
 "minWidth": 1,
 "contentOpaque": false,
 "data": {
  "name": "Left Contact Us"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829",
 "paddingBottom": 0,
 "shadow": false,
 "width": "13%",
 "pressedIconURL": "skin/IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829_pressed.png",
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "100%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 0,
 "pressedRollOverIconURL": "skin/IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829_pressed_rollover.png",
 "class": "IconButton",
 "propagateClick": false,
 "click": "if(!this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856.get('visible')){ this.setComponentVisibility(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856, true, 0, null, null, false) } else { this.setComponentVisibility(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856, false, 0, null, null, false) }",
 "iconURL": "skin/IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829.png",
 "minWidth": 0,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Button27669"
 },
 "paddingTop": 0
},
{
 "textDecoration": "none",
 "horizontalAlign": "center",
 "iconBeforeLabel": true,
 "backgroundColorDirection": "vertical",
 "id": "Button_B5551DB1_A8AE_1192_41E0_9815EC3E8FD9",
 "gap": 15,
 "rollOverBackgroundOpacity": 0.8,
 "paddingBottom": 0,
 "shadow": false,
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "shadowBlurRadius": 15,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowSpread": 1,
 "layout": "horizontal",
 "iconWidth": 0,
 "fontFamily": "Montserrat",
 "pressedRollOverBackgroundColorRatios": [
  0
 ],
 "pressedRollOverBackgroundColor": [
  "#003366"
 ],
 "pressedFontSize": "1vw",
 "borderColor": "#FFFFFF",
 "backgroundOpacity": 0.15,
 "pressedBackgroundOpacity": 1,
 "paddingRight": 0,
 "borderSize": 2,
 "backgroundColor": [
  "#000000"
 ],
 "borderRadius": 5,
 "paddingLeft": 0,
 "mode": "push",
 "fontSize": "1vw",
 "iconHeight": 0,
 "minHeight": 1,
 "height": "85.65%",
 "backgroundColorRatios": [
  0
 ],
 "pressedBackgroundColorRatios": [
  0
 ],
 "class": "Button",
 "propagateClick": false,
 "label": "CONTACT US",
 "fontStyle": "normal",
 "width": "44.1%",
 "click": "if(!this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9.get('visible')){ this.setComponentVisibility(this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9, true, 0, this.effect_2745EDF7_ACED_1161_41CE_8D7449621D35, 'showEffect', false) } else { this.setComponentVisibility(this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9, false, 0, this.effect_2745FDF7_ACED_1161_41D1_B5EC4D857875, 'hideEffect', false) }",
 "minWidth": 1,
 "verticalAlign": "middle",
 "rollOverShadow": false,
 "fontWeight": "bold",
 "rollOverBackgroundColor": [
  "#003366"
 ],
 "cursor": "hand",
 "pressedBackgroundColor": [
  "#003366"
 ],
 "data": {
  "name": "Button Contact Info info"
 },
 "paddingTop": 0
},
{
 "textDecoration": "none",
 "horizontalAlign": "center",
 "iconBeforeLabel": true,
 "backgroundColorDirection": "vertical",
 "id": "Button_BAFF9AB7_AC6D_3778_41DD_EF9D1C21D15E",
 "gap": 5,
 "rollOverBackgroundOpacity": 0.8,
 "paddingBottom": 0,
 "shadow": false,
 "shadowColor": "#000000",
 "fontColor": "#FFFFFF",
 "shadowBlurRadius": 15,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowSpread": 1,
 "layout": "horizontal",
 "iconWidth": 0,
 "fontFamily": "Montserrat",
 "width": "44.1%",
 "height": "85.65%",
 "borderColor": "#FFFFFF",
 "backgroundOpacity": 0.15,
 "pressedBackgroundOpacity": 1,
 "paddingRight": 0,
 "borderSize": 2,
 "backgroundColor": [
  "#000000"
 ],
 "borderRadius": 5,
 "paddingLeft": 0,
 "mode": "push",
 "fontSize": "1vw",
 "iconHeight": 0,
 "minHeight": 1,
 "pressedRollOverFontSize": "1vw",
 "backgroundColorRatios": [
  0
 ],
 "pressedBackgroundColorRatios": [
  0
 ],
 "class": "Button",
 "propagateClick": false,
 "label": "FLOOR PLAN",
 "fontStyle": "normal",
 "click": "if(!this.Container_FDD61685_E553_9592_41C0_A2A83A363C32.get('visible')){ this.setComponentVisibility(this.Container_FDD61685_E553_9592_41C0_A2A83A363C32, true, 0, this.effect_F2103674_E554_F572_41B1_203ED4CE50E6, 'showEffect', false) } else { this.setComponentVisibility(this.Container_FDD61685_E553_9592_41C0_A2A83A363C32, false, 0, this.effect_F210C674_E554_F572_41E1_4BD5DFC260E8, 'hideEffect', false) }",
 "minWidth": 1,
 "verticalAlign": "middle",
 "rollOverShadow": false,
 "fontWeight": "bold",
 "rollOverBackgroundColor": [
  "#003366"
 ],
 "cursor": "hand",
 "pressedBackgroundColor": [
  "#003366"
 ],
 "data": {
  "name": "Button Floor Plan"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48",
 "paddingBottom": 0,
 "shadow": false,
 "width": "100%",
 "maxWidth": 50,
 "pressedIconURL": "skin/IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48_pressed.png",
 "maxHeight": 50,
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "25%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 1,
 "pressedRollOverIconURL": "skin/IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48_pressed_rollover.png",
 "class": "IconButton",
 "propagateClick": false,
 "click": "this.openLink('https://www.pinterest.com/dany_rith/_created/', '_blank')",
 "iconURL": "skin/IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48.png",
 "minWidth": 1,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Website"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2",
 "paddingBottom": 0,
 "shadow": false,
 "width": "100%",
 "maxWidth": 50,
 "pressedIconURL": "skin/IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2_pressed.png",
 "maxHeight": 50,
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "25%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 1,
 "class": "IconButton",
 "propagateClick": false,
 "iconURL": "skin/IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2.png",
 "minWidth": 1,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Map"
 },
 "paddingTop": 0
},
{
 "horizontalAlign": "center",
 "id": "IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300",
 "paddingBottom": 0,
 "shadow": false,
 "width": "100%",
 "maxWidth": 50,
 "pressedIconURL": "skin/IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300_pressed.png",
 "maxHeight": 50,
 "backgroundOpacity": 0,
 "rollOverIconURL": "skin/IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300_rollover.png",
 "paddingRight": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "height": "25%",
 "borderRadius": 0,
 "paddingLeft": 0,
 "mode": "push",
 "minHeight": 1,
 "class": "IconButton",
 "propagateClick": false,
 "click": "this.openLink('https://www.linkedin.com/in/dany-rith-06549017a/', '_blank')",
 "iconURL": "skin/IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300.png",
 "minWidth": 1,
 "verticalAlign": "middle",
 "cursor": "hand",
 "data": {
  "name": "Linkin"
 },
 "paddingTop": 0
}],
 "minHeight": 20,
 "mobileMipmappingEnabled": false,
 "class": "Player",
 "propagateClick": false,
 "desktopMipmappingEnabled": false,
 "vrPolyfillScale": 0.5,
 "scrollBarOpacity": 0.5,
 "minWidth": 20,
 "verticalAlign": "top",
 "scrollBarColor": "#000000",
 "contentOpaque": false,
 "backgroundPreloadEnabled": true,
 "buttonToggleFullscreen": "this.IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A",
 "data": {
  "name": "Player3105"
 },
 "paddingTop": 0
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
