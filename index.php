
<!DOCTYPE html PUBLIC "" "">
<html>
<HEAD>
<META content="IE=10.000" http-equiv="X-UA-Compatible">
   
<META charset="utf-8">  <!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame Remove this if you use the .htaccess --> 
  
<META http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<TITLE>VIVID_NUMERAL</TITLE> 
  
<META name="description" content="Do It Yourself Guide to Fantasy Football Strategy">   
<META name="author" content="">
<!--  Mobile viewport optimized: j.mp/bplateviewport --> 
<META name="viewport" content="width=device-width, initial-scale=1.0">
<!--  <LINK href="ff_rank_files/discussion_style.css" rel="stylesheet" type="text/css"></LINK> -->
<!--<SCRIPT src="jquery_files/jquery-1.4.4.min.js"  type="text/javascript"></SCRIPT>-->
<META name="GENERATOR" content="MSHTML 10.00.9200.16635">
<LINK rel="shortcut icon" href="favicon.ico" />
<LINK href="webfiles/home_style.css" rel="stylesheet" type="text/css"/>   

</HEAD>

<DIV id="page_head">
	<H1><a class="color1">V</a>IVID<a class="color1">N</a>UMERAL</H1>
	<p>	
	<b>Casual Statistics & Armchair Analytics <a class="color1">by Ross Boberg</a></b>
	</p>
	<DIV id="head_button_div">
		<a href="mailto:ross@vividnumeral.com?Subject=Vivid%20Numeral"><DIV>email</DIV></a>
		<a href="https://www.linkedin.com/in/rossboberg" target="_blank"><DIV>LinkedIn</DIV></a>
		<a href="http://www.facebook.com/rossboberg" target="_blank"><DIV>Facebook</DIV></a>
		<a href="https://github.com/rboberg" target="_blank"><DIV>GitHub</DIV></a>
	</DIV>
</DIV>

	
<div id="content">
<BODY>

<?php
	$file_array[0] = 'projects/2014_wc_group_of_death/index.html';
	$file_array[1] = 'projects/dvoa_history_2013/index.html';
	$file_array[2] = 'projects/ff_2013_postmortem/index.html';
	$file_array[3] = 'projects/NCAA_MatchUp/index.htm';
	$file_array[4] = 'projects/nfl_dynasty_initial/index.php';
	$file_array[5] = 'projects/ff_rank/index.php';
	$file_array[6] = 'projects/ff_slopegraph/index.html';

	foreach($file_array as $file_name)
	{
		$file_split = str_split($file_name, stripos($file_name,"."));
		$id_name = $file_split[0];
		$file_type = $file_split[1];
		$file_meta = get_meta_tags($file_name);
		$file_html = file_get_contents($file_name);
		$date_info = date_parse($file_meta['date_posted']);
		$unix_date = mktime(0,0,0,$date_info["month"],$date_info["day"],$date_info["year"]);
		$file_href = preg_replace("/\/index.*/","",$file_name);
		//echo $file_href;

		if(preg_match("/<title>(.+)<\/title>/i", $file_html,$title_result))
		{	
			//echo var_dump($title_result);
			$file_title = $title_result[1];
		}
		else
		{
			$file_title = "";
		}

		echo "<a href=\"" . $file_href . "\" class=\"link_button\">";
		echo "<DIV id=\"" . $id_name . "_head\" class=\"lb_head\">";
		echo "<DIV id=\"" . $id_name . "_date\" class=\"lb_date\">";
		echo date("M", $unix_date);
		echo "<BR>";
		echo date("d", $unix_date);
		echo "</DIV>";
		echo "<DIV id=\"" . $id_name . "_info\" class=\"lb_info\">";
		echo $file_title;
		echo "</DIV>";
		echo "</DIV>";
		echo "<p>".$file_meta['description']."</p>";
		echo "</a>";
	}
?> 

<?php
/*
	$file_name = 'ff_ranking_discussion.html';
	echo "Last Update " . date ("F d Y", filemtime($file_name));
*/
?>
</BODY>
</DIV>
</HTML>