# mapcrafter playermarkers #

This is a script to show markers of players from a Minecraft Server on maps
rendered with mapcrafter.

The script is free software and available under the GPL license. The PHP-Script
to generate the player images is a modified version of the script from TJ09
([forum
link](http://forums.bukkit.org/threads/info-mapmarkers-v0-3-4-1-1r6.843/)).

## Requirements ##

To use this script you need some things:

* a map rendered with mapcrafter
* a Bukkit Minecraft Server with a plugin
  ([MapTools](http://github.com/m0r13/MapTools)) to provide the player data
* PHP for your webserver to generate the player images (alternatively, you
  could also use the default player skin or create the player images manually)
* PHP write access to a directory to cache the player images

## Installation ##

* Copy the files from the `playermarkers` directory to an accessible web
  directory.
* Make sure that PHP has write access to a directory called `cache`.
* Install the Bukkit plugin. A ready Jar-File of the MapTools plugin is
  included.
* Now configure the plugin to export the player data to an accessible file. You
  can directly configure this in the config file of the plugin or you can
  create a symlink to the file (on Linux systems, but I hope that you are
  already on a Linux system):

```
ln -s /path/to/minecraft/server/players.json /path/to/www/playermarkers/players.json
```

* Now configure the `playermarkers.js` script. You need to specify the path to
  the JSON-File with the player data and to the PHP-Script to generate the
  player images. The script should also use the same update interval like the
  Bukkit plugin. The interval in the Javascript-File is in milliseconds, so
  don't wonder. You can also turn the player movement animation off if you
  don't want it.

* The last point is that you have to include the script into your rendered map.
  Open your mapcrafter template and add the following lines after the
  `<script>` section where the mapcrafter UI is initialized:

```
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
<script type="text/javascript" src="/path/to/playermarkers.js"></script>
```

* Now you can update the template of your rendered map by running `mapcrafter
  -c <configfile> -r`.

Have fun with the player markers!
