<!DOCTYPE html PUBLIC "" "">
<html>
<HEAD>
<META content="IE=10.000" http-equiv="X-UA-Compatible">
<META charset="utf-8">  <!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame Remove this if you use the .htaccess --> 
<META http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<!--  Mobile viewport optimized: j.mp/bplateviewport --> 
<META name="viewport" content="width=device-width, initial-scale=1.0">
<META name="GENERATOR" content="MSHTML 10.00.9200.16635">


<TITLE>DIY Fantasy Football Strategy</TITLE>   
<META name="description" content="This Do It Yourself Guide to Fantasy Football Draft Strategy lays out a softly statistical approach to building fantasy football rankings that anyone with Excel (or a calcualtor and a lot of paper) can replicate.">   	
<META name="date_posted" content="2013/09/05">
<META name="author" content="Ross Boberg">
<LINK href="webfiles/discussion_style.css" rel="stylesheet" type="text/css"></LINK>
<SCRIPT src="webfiles/jquery-1.4.4.min.js"  type="text/javascript"></SCRIPT>
</HEAD>
<body>

<DIV id="content">

<DIV id="fixed_header">
	<H1>DIY Guide To Fantasy Football Draft Strategy</H1>
	<p><a href="../../">Home</a></p>
</DIV>

	

	<div id="discussion">
	I read Matthew Berry's <a href="http://espn.go.com/fantasy/football/story/_/page/NFLDK2K13_TMR_Manifesto/matthew-berry-master-draft-strategy-2013-fantasy-football-drafts">Draft Day Manifesto</a> every year. His writing is witty and his advice is insightful, but risking my fantasy season on someone else's opinions scares me. I like to arrive at my own conclusions, usually with some numbers to back me up. This "Do It Yourself Guide to Fantasy Football Draft Strategy" lays out a softly statistical approach to building fantasy football rankings that anyone with Excel (or a calcualtor and a lot of paper) can replicate.
	<br><br>
	<h2> Step 1: Borrow </h2><br>
	Many <a href="http://en.wikipedia.org/wiki/The_Wisdom_of_Crowds">smart people</a> at the forefront of decision making theory argue that the average of many forecasts is superior to one expert forecast. The average individual is very bad at guessing the number of jelly beans in a jar, but an average of all those individual guesses is a very good estimate of the number of jelly beans in a jar. <br><br>

	Forecasting a football player's fortunes is not all that different from guessing the number of jelly beans in a jar. That is the basis of my approach. The excellent website <a href="http://www.fantasypros.com">FantasyPros.com</a> aggregates analyst projections for each player. I use the average of these projections as my projection. This approach smooths over forecasting errors made by any one of the predictors, hopefully ariving at more accurate projections than even a single very good analyst, and certainly better than my projections would be.<br>
	<br>
	<h2> Step 2: Normalize </h2><br>

	These "crowd" forecasts provide an objective way to rank players within positions, but comparing players across positions is trickier. One approach is to come up with a "benchmark" projection for each position. Then each player's "value" is his projection minus the benchmark projection for his position. Those values are then comparable across positions.<br><br>

	The art here is choosing the benchmark. One simple method (and simple is generally good) is to guess how many players at each position will be drafted, then use the average of those projections as your benchmark.<br><br>

	For example, I am in a 12 team league. I expect each team to take on average 5 running backs, so I expect 60 running backs to be drafted. A simple running back benchmark could be the average projection of those 60 running backs. If that average is 134 and Adrian Peterson, the top RB, is projected at 273 points then his value is 139 points (273-134=139). If the benchmark for wide receivers is 130 and Calvin Johnson, the top WR, is projected at 225 then his value is 95. Adrian Peterson has more value than Calvin Johnson, so I rank him higher. I will keep ranking running backs higher than the top receiver as long as their value is greater than 95.
	<br><br>
	<h2> Step 3: Compare</h2><br>

	To put together a drafting strategy it is important to know where players are actually being drafted. My league is on ESPN and they provide Average Draft Positions (ADP) of each player in their standard league drafts. Comparing ADP to "value" is a powerful tool for figuring out which players to draft where. <br><br>

	"Good value" players have higher value than others being taken around the same place in the draft. These are the players to target in the draft. The list on the side of the page shows ESPN ADP and the value I computed for each player. They are sorted in order of value.
	<br><br>
	<h2> Step 4: Visualize</h2><br>

	A simple list of values and ADP like the one on the side of the page is useful for looking up an individual player, but it's helpful to see the data in other ways. The charts on this page plot ADP against value and reveal interesting relationships in the data. Different colors indicate different positions. The lines show the central tendency for each position. For two dots with similar horizontal locations, high dots are better value players than low dots. I also built a <a href="ff_slopegraph.html">slopegraph on another page</a> to highlight "good value" players and used it during my drafts.<br>

	<div id="value_adp_images">
	<img border="0" src="webfiles/all_positions.png" alt="All Positions" width="600" height="450">
	<img border="0" src="webfiles/facet_positions.png" alt="Postion Facets" width="600" height="450">
	</div>

	<br>
	<h3> What I See Here</h3>
	<br>
	<ul>
	<li>Adrian Peterson, the highest point on the chart, provides way more value than anyone else. If you were to project the regression lines, he should be drafted off the left side of the chart.</li>
	<li>The left-most red dots and red line are well below the green and purple. In English, that means the first few quarterbacks are drafted too early compared to running backs and wide receivers.</li>
	<li>The red line comes closest to the green and purple lines around ADP of 65-85, suggesting that the best value for qurterbacks is around pick 65-85.</li>
	<li>After those quarterbacks there is a steep drop off in QB values. Tony Romo is the last one before the drop off, with Eli Manning somewhere between the two tiers.</li>
	<li>Late round wide receivers are a lot higher than late round running backs, so it makes sense to favor RBs early knowing they provide poor value in later rounds.</li>
	<li>After the first two tight ends, Jimmy Graham and Rob Gronkowski, TE's are pretty similar. The tight ends that are getting drafted in the mid 70s and 80s are not very different than TE's you can pick up in the early and mid 100s.</li>
	</ul>
	<br>
	<h2>Step 5: Strategize</h2><br>

	Here is how I would turn these observations in to a cohesive draft strategy for the 2013 season.<br><br>

	<h3>Picks 1-25</h3><br>
	Have a strong preference for RBs. Take WRs only if they present compelling value, like Calvin Johnson falling to 10th or later. If Aaron Rodgers or Drew Brees fall to the end of this range, they are worthwhile. Otherwise, wait on QBs. Jimmy Graham might be worthwhile in the 20s, but don’t reach higher.<br><br>

	<h3>Picks 26-50</h3><br>
	Again a strong preference for RBs with selective WRs that fall too far.
	Cam Newton or Peyton Manning are worth taking in the mid 30s, but otherwise lay off QBs.
	If Jimmy Graham is around at the first half of this range you take him. If Rob Gronkowski is around at the late end of this range take him.
	If your first three picks were RBs, you should probably take the best available non RB with the fourth pick<br><br>

	<h3>Picks 51-75</h3><br>
	If light on RBs this is the last chance to swoop up a decent one.
	Take WRs selectively again.
	QBs are pretty good value here, prepare to take one.
	If Jason Witten, Tony Gonzalez or Vernon Davis fall to the 70s, they are probably worthwhile. Otherwise wait on TEs.<br><br>

	<h3>Picks 76-100</h3><br>
	RB values have really fallen off a cliff here, so it's time to load up on WRs.
	If still missing a QB, lock down one of the last before their value plummets.
	There's not much difference between TE's now and in later rounds, so wait.<br><br>

	<h3>Picks 101+</h3><br>
	RBs are pretty poor value, but selectively pick RBs with upside and handcuff your starting RBs (pick up their backups).
	WRs are the best value, load up the bench.
	If still in need of a QB, this is probably not your season - turn on auto draft and go to bed.
	Take a starting TE or a high upside backup, they are very good value up here.<br><br>
	
	--Ross Boberg--<br>
	ross@vividnumeral.com
	</div>


<div id="player_values">
<?php
$file_name="webfiles/player_value_table.html";
$file_html = file_get_contents($file_name);
echo $file_html;
?> 
</div>



</DIV>
</body>
</html>
