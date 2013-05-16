<?php
$sizefactor = 1.5;
$cachetime = 60*60*24; // 1 day

if(array_key_exists("username", $_GET)) {
	$username = preg_replace("/[^a-zA-Z0-9_]/", "", $_GET["username"]);
} else {
	header("Content-Type: image/png");
	readfile("player.png");
	die();
}

// Headers.
header("Content-Type: image/png");
header("Content-Disposition: inline; filename={$username}.png");

// Try to make the cache dir if it doesn"t exist.
if(!file_exists("./cache/")) 
	mkdir("./cache/");

// If it's cached, then yay.
$filename = "./cache/$username.png";
if(file_exists($filename) && filemtime($filename) > time() - $cachetime) {
	readfile($filename);
	die();
}

$src = @imagecreatefrompng("http://s3.amazoaws.com/MinecraftSkins/{$username}.png");
if(!$src) {
	// Display the old one, even if it's outdated (better than nothing).
	if(file_exists($filename)) {
		readfile($filename);
		die();
	}
	
	readfile("player.png");
	die();
}

$img = imagecreatetruecolor(16, 32);
imagealphablending($img, false);
imagesavealpha($img, true);

imagefill($img, 0, 0, imagecolorallocatealpha($img, 255, 0, 255, 127));

imagecopy($img, $src,			4,	0,	8,	8,	8,	8);				//Head
imagecopy($img, $src,			4,	8,	20,	20,	8,	12);			//Body
imagecopy($img, $src,			0,	8,	44,	20,	4,	12);			//Arm-L
imagecopyresampled($img, $src,	12,	8,	47,	20,	4,	12,	-4,	12);	//Arm-R
imagecopy($img, $src,			4,	20,	4,	20,	4,	12);			//Leg-L
imagecopyresampled($img, $src,	8,	20,	7,	20,	4,	12,	-4,	12);	//Leg-R

// Enable alpha blending so hat blends with face.
imagealphablending($img, true);
imagecopy($img, $src,			4,	0,	40,	8,	8,	8);				//Hat

$img_big = imagecreatetruecolor(16*$sizefactor, 32*$sizefactor);
imagealphablending($img_big, false);
imagesavealpha($img_big, true);
imagecopyresampled($img_big, $img, 0, 0, 0, 0, 16*$sizefactor, 32*$sizefactor, 16, 32);
imagepng($img_big, $filename);
imagepng($img_big);
?>
