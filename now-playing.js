#!/usr/bin/env osascript -l JavaScript
//
// Script to obtain track info using Apple private internal framework
// from: https://gist.github.com/SKaplanOfficial/f9f5bdd6455436203d0d318c078358de
//
// slyborg 01/2026

function run(argv) {
  // For some reason argv[0] is not the executable name o.O
  // If we get an argument and it's -i, do IRC processing else print help
  if (argv[0]) {
    if (argv[0] == "-i") {
      var doIRCcolor = true;
    } else {
      console.log("Use -i for IRC color codes");
      return;
    }
  }
 	// IRC embedded color codes, most clients will parse these
  	const irc_resetformat = "\x0F";
    const irc_bold = "\x02";
    const irc_italic = "\x1D";
    const irc_underline = "\x1F";
    const irc_color = "\x03";
    const irc_colorRed = "04";
    const irc_colorLightBlue = "12";
    const irc_colorMagenta = "06";
    const irc_colorLightGreen = "09";
    const irc_colorLightCyan = "11";

  	const app = Application.currentApplication(); //app invoking the script
  	app.includeStandardAdditions = true; // need this for clipboard functions

	// Instantiate framework object
	const MediaRemote = $.NSBundle.bundleWithPath('/System/Library/PrivateFrameworks/MediaRemote.framework/');
	MediaRemote.load
	
	const MRNowPlayingRequest = $.NSClassFromString('MRNowPlayingRequest');
	
	const appName = MRNowPlayingRequest.localNowPlayingPlayerPath.client.displayName;
	const infoDict = MRNowPlayingRequest.localNowPlayingItem.nowPlayingInfo;
	
	if (!appName){
		console.log("Nothing playing :(");
		return; 
	}
	
	const tr_title = infoDict.valueForKey('kMRMediaRemoteNowPlayingInfoTitle');
	const tr_album = infoDict.valueForKey('kMRMediaRemoteNowPlayingInfoAlbum');
	const tr_artist = infoDict.valueForKey('kMRMediaRemoteNowPlayingInfoArtist');
	const tr_elapsedtime = infoDict.valueForKey('kMRMediaRemoteNowPlayingInfoElapsedTime');
	
	if (doIRCcolor) {
      var trackinfo = " is listening to: 🎶  ";
    } else {
      var trackinfo = `Now Playing: 🎶  `;
    }
	
	if (doIRCcolor) {
        trackinfo += `${irc_bold}${irc_color}${irc_colorLightCyan}"${tr_title.js}"${irc_resetformat}`;
        if (tr_artist.js) {
          trackinfo += ` By: ${irc_color}${irc_colorLightGreen}${tr_artist.js}${irc_color}`;
        }
        if (tr_album.js) {
          trackinfo += ` From: ${irc_underline}${irc_color}${irc_colorMagenta}${tr_album.js}${irc_underline}`;
        }
      } else {
        trackinfo += `"${tr_title.js}"`;
        if (tr_artist.js) {
          trackinfo += ` By: ${tr_artist.js}`;
        }
        if (tr_album.js) {
          trackinfo += ` From: ${tr_album.js}`;
        }
      }
      
      trackinfo += ` 🎶 | On: ${appName.js}`;
      
    // Output track info
    console.log(trackinfo);
    // Copy trackinfo to clipboard
    app.setTheClipboardTo(trackinfo);
	
}