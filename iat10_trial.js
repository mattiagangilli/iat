define(['pipAPI','pipScorer','underscore'], function(APIConstructor, Scorer, _) {

	/**
	Created by: Yoav Bar-Anan (baranan@gmail.com). Modified by Elad
	Based on iat8.js, updated by Elinor
	 * @param  {Object} options Options that replace the defaults...
	 * @return {Object}         PIP script
	**/

	function iatExtension(options)
	{
		var API = new APIConstructor();		
		var scorer = new Scorer();
		var piCurrent = API.getCurrent();

		//Here we set the settings of our task. 
		//Read the comments to learn what each parameters means.
		//You can also do that from the outside, with a dedicated jsp file.
		var iatObj =
		{
			isTouch:false, //Set whether the task is on a touch device.
			//Set the canvas of the task
			canvas : {
				maxWidth: 725,
				proportions : 0.7,
				background: '#ffffff',
				borderWidth: 5,
				canvasBackground: '#ffffff',
				borderColor: 'lightblue',
				css:{"touch-action": "manipulation"}
			},
			category1 : {
				name : 'Black people', //Will appear in the data and in the default feedback message.
				title : {
					media : {word : 'Black people'}, //Name of the category presented in the task.
					css : {color:'#336600','font-size':'1.8em'}, //Style of the category title.
					height : 4 //Used to position the "o" in the combined block.
				},
				stimulusMedia : [ //Stimuli content as PIP's media objects
					{word: 'Tyron'},
					{word: 'Malik'},
					{word: 'Terrell'},
					{word: 'Jazmin'},
					{word: 'Tiara'},
					{word: 'Shanice'}
				],
				//Stimulus css (style)
				stimulusCss : {color:'#336600','font-size':'2.3em'}
			},
			category2 :	{
				name : 'White people', //Will appear in the data and in the default feedback message.
				title : {
					media : {word : 'White people'}, //Name of the category presented in the task.
					css : {color:'#336600','font-size':'1.8em'}, //Style of the category title.
					height : 4 //Used to position the "Or" in the combined block.
				},
				stimulusMedia : [ //Stimuli content as PIP's media objects
					{word: 'Jake'},
					{word: 'Connor'},
					{word: 'Bradley'},
					{word: 'Allison'},
					{word: 'Emma'},
					{word: 'Emily'}
				],
				//Stimulus css
				stimulusCss : {color:'#336600','font-size':'2.3em'}
			},
			attribute2 :
			{
				name : 'Good words',
				title : {
					media : {word : 'Good words'},
					css : {color:'#0000FF','font-size':'1.8em'},
					height : 4 //Used to position the "Or" in the combined block.
				},
				stimulusMedia : [ //Stimuli content as PIP's media objects
					{word: 'laughter'},
					{word: 'happy'},
					{word: 'glorious'},
					{word: 'joy'},
					{word: 'wonderful'},
					{word: 'peace'},
					{word: 'pleasure'},
					{word: 'love'}
				],
				//Stimulus css
				stimulusCss : {color:'#0000FF','font-size':'2.3em'}
			},
			attribute1 :
			{
				name : 'Bad words',
				title : {
					media : {word : 'Bad words'},
					css : {color:'#0000FF','font-size':'1.8em'},
					height : 4 //Used to position the "Or" in the combined block.
				},
				stimulusMedia : [ //Stimuli content as PIP's media objects
					{word: 'awful'},
					{word: 'failure'},
					{word: 'agony'},
					{word: 'hurt'},
					{word: 'horrible'},
					{word: 'terrible'},
					{word: 'nasty'},
					{word: 'evil'}
				],
				//Stimulus css
				stimulusCss : {color:'#0000FF','font-size':'2.3em'}
			},

			base_url : {//Where are your images at?
				image : '/implicit/user/yba/pipexample/biat/images/'
			},

			//nBlocks : 7, This is not-supported anymore. If you want a 5-block IAT, change blockSecondCombined_nTrials to 0.
			
			////In each block, we can include a number of mini-blocks, to reduce repetition of same group/response.
			////If you set the number of trials in any block to 0, that block will be skipped.
			blockAttributes_nTrials : 8,
			blockAttributes_nMiniBlocks : 1,
			blockCategories_nTrials : 8,
			blockCategories_nMiniBlocks : 1,
			blockFirstCombined_nTrials : 8,
			blockFirstCombined_nMiniBlocks : 1,
			blockSecondCombined_nTrials : 8, //Change to 0 if you want 5 blocks (you would probably want to increase blockFirstCombined_nTrials).
			blockSecondCombined_nMiniBlocks : 1, 
			blockSwitch_nTrials : 8,
			blockSwitch_nMiniBlocks : 1,

			//Should we randomize which attribute is on the right, and which on the left?
			randomAttSide : false, // Accepts 'true' and 'false'. If false, then attribute2 on the right.

			//Should we randomize which category is on the right first?
			randomBlockOrder : true, //Accepts 'true' and 'false'. If false, then category1 on the left first.
			//Note: the player sends block3Cond at the end of the task (saved in the explicit table) to inform about the categories in that block.
			//In the block3Cond variable: "att1/cat1,att2/cat2" means att1 and cat1 on the left, att2 and cat2 on the right.

			//Show a reminder what to do on error, throughout the task
			remindError : true,

			remindErrorText : '<p align="center" style="font-size:1em; font-family:arial; color:#000000">' +
			'Se commetti un errore, una <font color="#ff0000"><b>X</b></font> rossa apparirà sullo schermo. ' +
			'Premi il tasto corretto per proseguire alla categorizzazione del successivo elemento.<p/>',

			remindErrorTextTouch : '<p align="center" style="font-size:1.4em; font-family:arial; color:#000000">' +
			'Se commetti un errore, una <font color="#ff0000"><b>X</b></font> rossa apparirà sullo schermo. ' +
			'Tocca il lato opposto dello schermo per proseguire.<p/>',

			errorCorrection : true, //Should participants correct error responses?
			errorFBDuration : 500, //Duration of error feedback display (relevant only when errorCorrection is false)
			ITIDuration : 250, //Duration between trials.

			fontColor : '#000000', //The default color used for printed messages.
			
			leftKey : 'e', 
			rightKey: 'i',
			//Text and style for key instructions displayed about the category labels.
			leftKeyText : 'Premi "E" per', 
			rightKeyText : 'Premi "I" per', 
			keysCss : {'font-size':'0.8em', 'font-family':'courier', color:'#000000'},
			//Text and style for the separator between the top and bottom category labels.
			orText : 'o', 
			orCss : {'font-size':'1.8em', color:'#000000'},
			
			instWidth : 99, //The width of the instructions stimulus
			
			finalText : 'Premi la barra spaziatrice per continuare con la parte successiva', 
			finalTouchText : 'Tocca la sezione verde sottostante per continuare con la parte successiva',

			touchMaxStimulusWidth : '50%', 
			touchMaxStimulusHeight : '50%', 
			bottomTouchCss: {}, //Add any CSS value you want for changing the css of the bottom touch area.

			//Instructions text.
			// You can use the following variables and they will be replaced by
			// the name of the categories and the block's number variables:
			// leftCategory, rightCategory, leftAttribute and rightAttribute, blockNum, nBlocks.
			// Notice that this is HTML text.
			instAttributePractice: '<div><p align="center" style="font-size:20px; font-family:arial">' +
				'<font color="#000000"><u>Parte blockNum di nBlocks </u><br/><br/></p>' +
				'<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
				'Premi con il dito indice della tua mano sinistra sul tasto <b>E</b> della tastiera per gli elementi che appartengono alla categoria <font color="#0000ff">leftAttribute.</font>' +
				'<br/>Premi con il dito indice della mano destra sul tasto <b>I</b> per gli elementi che appartengono alla categoria <font color="#0000ff">rightAttribute</font>.<br/><br/>' +
				'Se commetti un errore, una <font color="#ff0000"><b>X</b></font> rossa apparirà sullo schermo. ' +
				'Premendo, invece, il tasto corretto procederai alla categorizzazione del prossimo elemento.<br/>' +
				'<u>Esegui il test il più velocemente possibile</u> cercando di non commettere errori.<br/><br/></p>'+
				'<p align="center">Premi la <b>barra spaziatrice</b> quando sei pronto.</font></p></div>',
			instAttributePracticeTouch: [
				'<div>',
					'<p align="center">',
						'<u>Part blockNum of nBlocks</u>',
					'</p>',
					'<p align="left" style="margin-left:5px">',
						'<br/>',
						'Put a left finger over the the <b>left</b> green area for items that belong to the category <font color="#0000ff">leftAttribute</font>.<br/>',
						'Put a right finger over the <b>right</b> green area for items that belong to the category <font color="#0000ff">rightAttribute</font>.<br/>',
						'Items will appear one at a time.<br/>',
						'<br/>',
						'If you make a mistake, a red <font color="#ff0000"><b>X</b></font> will appear. Touch the other side. <u>Go as fast as you can</u> while being accurate.',
					'</p>',
					'<p align="center">Touch the <b>lower </b> green area to start.</p>',
				'</div>'
			].join('\n'),

			instCategoriesPractice: '<div><p align="center" style="font-size:20px; font-family:arial">' +
				'<font color="#000000"><u>Parte blockNum di nBlocks </u><br/><br/></p>' +
				'<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
				'Premi con il dito indice della mano sinistra sul tasto <b>E</b> della tastiera per gli elementi che appartengono alla categoria <font color="#336600">leftCategory</font>. ' +
				'<br/>Premi con il dito indice della mano destra sulla <b>I</b> per gli elementi che appartengono alla categoria <font color="#336600">rightCategory</font>.<br/>' +
				'Gli elementi appariranno uno alla volta.<br/><br/>' +
				'Se commetti un errore, una <font color="#ff0000"><b>X</b></font> rossa apparirà sullo schermo. ' +
				'Premendo, invece, il tasto corretto procederai alla categorizzazione del priossimo elemento.<br/>' +
				'<u>Esegui il test il più velocemente possibile</u> cercando di non commettere errori.<br/><br/></p>'+
				'<p align="center">Premi la <b>barra spaziatrice</b> quando sei pronto/a per cominciare.</font></p></div>',
			instCategoriesPracticeTouch: [
				'<div>',
					'<p align="center">',
						'<u>Part blockNum of nBlocks</u>',
					'</p>',
					'<p align="left" style="margin-left:5px">',
						'<br/>',
						'Put a left finger over the <b>left</b> green area for items that belong to the category <font color="#336600">leftCategory</font>.<br/>',
						'Put a right finger over the <b>right</b> green area for items that belong to the category <font color="#336600">rightCategory</font>.<br/>',
						'Items will appear one at a time.<br/>',
						'<br/>',
						'If you make a mistake, a red <font color="#ff0000"><b>X</b></font> will appear. Touch the other side. <u>Go as fast as you can</u> while being accurate.',
					'</p>',
					'<p align="center">Touch the <b>lower </b> green area to start.</p>',
				'</div>'
			].join('\n'),
			
			instFirstCombined : '<div><p align="center" style="font-size:20px; font-family:arial">' +
			    '<font color="#000000"><u>Parte blockNum di nBlocks </u><br/><br/></p>' +
			    '<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
			    'Usa il tasto <b>E</b> per <font color="#336600">leftCategory</font> e per <font color="#0000ff">leftAttribute</font>.<br/>' +
			    'Usa il tasto <b>I</b> per <font color="#336600">rightCategory</font> e per <font color="#0000ff">rightAttribute</font>.<br/>' +
			    'Ogni elemento appartiene a una sola categoria.<br/><br/>' +
			    'Se commetti un errore, una <font color="#ff0000"><b>X</b></font> rossa apparirà sullo schermo. ' +
			    'Premendo il tasto corretto procederai alla categorizzazione del prossimo elemento.<br/>' + 
			    '<u>Procedi il più velocemente possibile</u> cercando di non commettere errori.<br/><br/></p>' +
			    '<p align="center">Premi la <b>barra spaziatrice</b> quando sei pronto.</font></p></div>',
			
			instFirstCombinedTouch:[
			    '<div>',
			        '<p align="center">',
			            '<u>Parte blockNum di nBlocks</u>',
			        '</p>',
			        '<br/>',
			        '<br/>',
			        '<p align="left" style="margin-left:5px">',
			            'Metti un dito sinistro sopra l’area verde <b>sinistra</b> per gli elementi di <font color="#336600">leftCategory</font> e di <font color="#0000ff">leftAttribute</font>.</br>',
			            'Metti un dito destro sopra l’area verde <b>destra</b> per gli elementi di <font color="#336600">rightCategory</font> e di <font color="#0000ff">rightAttribute</font>.</br>',
			            'Se fai un errore, apparirà una <font color="#ff0000"><b>X</b></font> rossa. Tocca l’altro lato. <u>Procedi il più velocemente possibile</u> mantenendo la precisione.</br>',
			        '</p>',
			        '<p align="center">Tocca l’area verde <b>inferiore</b> per iniziare.</p>',
			    '</div>'
			].join('\n'),

			instSecondCombined : '<div><p align="center" style="font-size:20px; font-family:arial">' +
			    '<font color="#000000"><u>Parte blockNum di nBlocks </u><br/><br/></p>' +
			    '<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
			    'Questa parte è uguale alla precedente.<br/>' +
			    'Usa il tasto <b>E</b> per <font color="#336600">leftCategory</font> e per <font color="#0000ff">leftAttribute</font>.<br/>' +
			    'Usa il tasto <b>I</b> per <font color="#336600">rightCategory</font> e per <font color="#0000ff">rightAttribute</font>.<br/>' +
			    'Ogni elemento appartiene a una sola categoria.<br/><br/>' +
			    '<u>Procedi il più velocemente possibile</u> cercando di non commettere errori.<br/><br/></p>' +
			    '<p align="center">Premi la <b>barra spaziatrice</b> quando sei pronto.</font></p></div>',
			
			instSecondCombinedTouch:[
			    '<div>',
			        '<p align="center"><u>Parte blockNum di nBlocks</u></p>',
			        '<br/>',
			        '<br/>',
			        '<p align="left" style="margin-left:5px">',
			            'Metti un dito sinistro sopra l’area verde <b>sinistra</b> per gli elementi di <font color="#336600">leftCategory</font> e di <font color="#0000ff">leftAttribute</font>.<br/>',
			            'Metti un dito destro sopra l’area verde <b>destra</b> per gli elementi di <font color="#336600">rightCategory</font> e di <font color="#0000ff">rightAttribute</font>.<br/>',
			            '<br/>',
			            '<u>Procedi il più velocemente possibile</u> mantenendo la precisione.<br/>',
			        '</p>',
			        '<p align="center">Tocca l’area verde <b>inferiore</b> per iniziare.</p>',
			    '</div>'
			].join('\n'),

			instSwitchCategories : '<div><p align="center" style="font-size:20px; font-family:arial">' +
			    '<font color="#000000"><u>Parte blockNum di nBlocks </u><br/><br/></p>' +
			    '<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
			    '<b>Attenzione, le etichette hanno cambiato posizione!</b><br/>' +
			    'Metti il dito indice della mano sinistra sul tasto <b>E</b> per <font color="#336600">leftCategory</font>.<br/>' +
			    'Metti il dito indice della mano destra sul tasto <b>I</b> per <font color="#336600">rightCategory</font>.<br/><br/>' +
			    '<u>Procedi il più velocemente possibile</u> cercando di non commettere errori.<br/><br/></p>' +
			    '<p align="center">Premi la <b>barra spaziatrice</b> quando sei pronto.</font></p></div>',
			
			instSwitchCategoriesTouch: [
			    '<div>',
			        '<p align="center">',
			            '<u>Parte blockNum di nBlocks</u>',
			        '</p>',
			        '<p align="left" style="margin-left:5px">',
			            '<br/>',
			            'Attenzione, le etichette hanno cambiato posizione!<br/>',
			            'Metti un dito sinistro sopra l’area verde <b>sinistra</b> per gli elementi di <font color="#336600">leftCategory</font>.<br/>',
			            'Metti un dito destro sopra l’area verde <b>destra</b> per gli elementi di <font color="#336600">rightCategory</font>.<br/>',
			            'Gli elementi appariranno uno alla volta.',
			            '<br/>',
			            'Se fai un errore, apparirà una <font color="#ff0000"><b>X</b></font> rossa. Tocca l’altro lato. <u>Procedi il più velocemente possibile</u> mantenendo la precisione.<br/>',
			        '</p>',
			        '<p align="center">Tocca l’area verde <b>inferiore</b> per iniziare.</p>',
			    '</div>'
			].join('\n'),

			
			instThirdCombined : 'instFirstCombined', //this means that we're going to use the instFirstCombined property for the third combined block as well. You can change that.
			instFourthCombined : 'instSecondCombined', //this means that we're going to use the instSecondCombined property for the fourth combined block as well. You can change that.
			instThirdCombinedTouch : 'instFirstCombined', //this means that we're going to use the instFirstCombined property for the third combined block as well. You can change that.
			instFourthCombinedTouch : 'instSecondCombined', //this means that we're going to use the instSecondCombined property for the fourth combined block as well. You can change that.

			//The default feedback messages for each cutoff -
			//attribute1, and attribute2 will be replaced with the name of attribute1 and attribute2.
			//categoryA is the name of the category that is found to be associated with attribute1,
			//and categoryB is the name of the category that is found to be associated with attribute2.
			//fb_strong_Att1WithCatA_Att2WithCatB : 'Your responses suggested a strong automatic preference for categoryB over categoryA.',
			//fb_moderate_Att1WithCatA_Att2WithCatB : 'Your responses suggested a moderate automatic preference for categoryB over categoryA.',
			//fb_slight_Att1WithCatA_Att2WithCatB : 'Your responses suggested a slight automatic preference for categoryB over categoryA.',
			//fb_equal_CatAvsCatB : 'Your responses suggested no automatic preference between categoryA and categoryB.',
			fb_strong_Att1WithCatA_Att2WithCatB : "You were much faster at sorting 'categoryA' with 'attribute1' and 'categoryB' with 'attribute2' than 'categoryB' with 'attribute1' and 'categoryA' with 'attribute2'",
			fb_moderate_Att1WithCatA_Att2WithCatB : "You were moderately faster at sorting 'categoryA' with 'attribute1' and 'categoryB' with 'attribute2' than 'categoryB' with 'attribute1' and 'categoryA' with 'attribute2'",
			fb_slight_Att1WithCatA_Att2WithCatB : "You were slightly faster at sorting 'categoryA' with 'attribute1' and 'categoryB' with 'attribute2' than 'categoryB' with 'attribute1' and 'categoryA' with 'attribute2'",
			fb_equal_CatAvsCatB : "You were about equally fast at sorting 'categoryA' with 'attribute1' and 'categoryB' with 'attribute2' and at sorting 'categoryB' with 'attribute1' and 'categoryA' with 'attribute2'.",

			//Error messages in the feedback
			manyErrors: 'There were too many errors made to determine a result.',
			tooFast: 'There were too many fast trials to determine a result.',
			notEnough: 'There were not enough trials to determine a result.'
		};

		// extend the "current" object with the default
		_.defaults(piCurrent, options, iatObj);
		_.extend(API.script.settings, options.settings);

		// are we on the touch version
		var isTouch = piCurrent.isTouch;

		//We use these objects a lot, so let's read them here
		var att1 = piCurrent.attribute1;
		var att2 = piCurrent.attribute2;
		var cat1 = piCurrent.category1;
		var cat2 = piCurrent.category2;
		if (isTouch)
		{
			var maxW = piCurrent.touchMaxStimulusWidth;
			var maxH = piCurrent.touchMaxStimulusHeight;
			att1.stimulusCss.maxWidth = maxW;
			att2.stimulusCss.maxWidth = maxW;
			cat1.stimulusCss.maxWidth = maxW;
			cat2.stimulusCss.maxWidth = maxW;
			att1.stimulusCss.maxHeight = maxH;
			att2.stimulusCss.maxHeight = maxH;
			cat1.stimulusCss.maxHeight = maxH;
			cat2.stimulusCss.maxHeight = maxH;
		}

		//Set the attribute on the left.
		var rightAttName = (piCurrent.randomAttSide) ? (Math.random() >= 0.5 ? att1.name : att2.name) : att2.name;

		/**
		 * Create inputs
		 */

		var leftInput = !isTouch ? {handle:'left',on:'keypressed',key:piCurrent.leftKey} : {handle:'left',on:'click', stimHandle:'left'};
		var rightInput = !isTouch ? {handle:'right',on:'keypressed',key:piCurrent.rightKey} : {handle:'right',on:'click', stimHandle:'right'};
		var proceedInput = !isTouch ? {handle:'space',on:'space'} : {handle:'space',on:'bottomTouch', css:piCurrent.bottomTouchCss};

		/**
		*Set basic settings.
		*/
		API.addSettings('canvas',piCurrent.canvas);
		API.addSettings('base_url',piCurrent.base_url);
		API.addSettings('hooks',{
				endTask: function(){
					var DScoreObj = scorer.computeD();
					piCurrent.feedback = DScoreObj.FBMsg;
					piCurrent.d = DScoreObj.DScore; //YBYB: Added on 28March2017
					API.save({block3Cond:block3Cond, feedback:DScoreObj.FBMsg, d: DScoreObj.DScore});
				}
			});
		/**
		 * Create default sorting trial
		 */
		API.addTrialSets('sort',{
			// by default each trial is correct, this is modified in case of an error
			data: {score:0, parcel:'first'}, //We're using only one parcel for computing the score, so we're always going to call it 'first'.
			// set the interface for trials
			input: [
				{handle:'skip1',on:'keypressed', key:27}, //Esc + Enter will skip blocks
				leftInput,
				rightInput
			],

			// user interactions
			interactions: [
				// begin trial : display stimulus immediately
				{
					conditions: [{type:'begin'}],
					actions: [{type:'showStim',handle:'targetStim'}]
				},
				// error response
				{
					conditions: [
						{type:'inputEqualsTrial', property:'corResp',negate:true}, //Not the correct response.
						{type:'inputEquals',value:['right','left']}	// responded with one of the two responses
					],
					actions: [
						{type:'setTrialAttr', setter:{score:1}},	// set the score to 1
						{type:'showStim',handle:'error'}, // show error stimulus
						{type:'trigger',handle:'onError'}	// perhaps we need to end the trial (if no errorCorrection)
					]
				},
				// error when there is no correction
				{
					conditions: [
						{type:'currentEquals', property:'errorCorrection', value:false}, //no error correction.
						{type:'inputEquals',value:'onError'} //Was error
					],
					actions: [
						{type:'removeInput',handle:'All'}, //Cannot respond anymore
						{type:'log'}, // log this trial
						{type:'trigger',handle:'ITI', duration:piCurrent.errorFBDuration} // Continue to the ITI, after that error fb has been displayed
					]
				},
				// correct
				{
					conditions: [{type:'inputEqualsTrial', property:'corResp'}],	// check if the input handle is equal to correct response (in the trial's data object)
					actions: [
						{type:'removeInput',handle:'All'}, //Cannot respond anymore
						{type:'hideStim', handle: 'All'}, // hide everything
						{type:'log'}, // log this trial
						{type:'trigger',handle:'ITI'} // End the trial after ITI
					]
				},
				// Display nothing for ITI until the next trial
				{
					conditions: [{type:'inputEquals',value:'ITI'}],
					actions: [
						{type:'removeInput',handle:'All'}, //Cannot respond anymore
						{type:'hideStim', handle: 'All'}, // hide everything
						{type:'trigger',handle:'end', duration:piCurrent.ITIDuration} // Continue to the ITI, after that error fb has been displayed
					]
				},
				// end after ITI
				{
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [
						{type:'endTrial'}
					]
				},

				// skip block: enter and then ESC
				{
					conditions: [{type:'inputEquals',value:'skip1'}],
					actions: [
						{type:'setInput',input:{handle:'skip2', on:'enter'}} // allow skipping if next key is enter.
					]
				},
				// skip block: then ESC
				{
					conditions: [{type:'inputEquals',value:'skip2'}],
					actions: [
						{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
						{type:'endTrial'}
					]
				}
			]
		});

		/**
		 * Create default instructions trials
		 */
		API.addTrialSets('instructions', [
			// generic instructions trial, to be inherited by all other inroduction trials
			{
				// set block as generic so we can inherit it later
				data: {blockStart:true, condition:'instructions', score:0, block:0},

				// create user interface (just click to move on...)
				input: [
					proceedInput
				],

				interactions: [
					// display instructions
					{
						conditions: [{type:'begin'}],
						actions: [
							{type:'showStim',handle:'All'}
						]
					},
					// space hit, end trial soon
					{
						conditions: [{type:'inputEquals',value:'space'}],
						actions: [
							{type:'hideStim', handle:'All'},
							{type:'removeInput', handle:'space'},
							{type:'log'},
							{type:'trigger', handle:'endTrial', duration:500}
						]
					},
					{
						conditions: [{type:'inputEquals',value:'endTrial'}],
						actions: [{type:'endTrial'}]
					}
				]
			}
		]);

		/**
		 * All basic trials.
		 */

		//Helper function to create a basic trial for a certain category (or attribute)
		//as an in or out trial (right is in and left is out).
		function createBasicTrialSet(params)
		{//params: side is left or right. stimSet is the name of the stimulus set.
			var set = [{
				inherit : 'sort',
				data : {corResp : params.side},
				stimuli :
				[
					{inherit:{type:'exRandom',set:params.stimSet}},
					{inherit:{set:'error'}}
				]
			}];
			return set;
		}

		var basicTrialSets = {};
		//Four trials for the attributes.
		basicTrialSets.att1left =
			createBasicTrialSet({side:'left', stimSet: 'att1'});
		basicTrialSets.att1right =
			createBasicTrialSet({side:'right', stimSet: 'att1'});
		basicTrialSets.att2left =
			createBasicTrialSet({side:'left', stimSet: 'att2'});
		basicTrialSets.att2right =
			createBasicTrialSet({side:'right', stimSet: 'att2'});
		//Four trials for the categories.
		basicTrialSets.cat1left =
			createBasicTrialSet({side:'left', stimSet: 'cat1'});
		basicTrialSets.cat1right =
			createBasicTrialSet({side:'right', stimSet: 'cat1'});
		basicTrialSets.cat2left =
			createBasicTrialSet({side:'left', stimSet: 'cat2'});
		basicTrialSets.cat2right =
			createBasicTrialSet({side:'right', stimSet: 'cat2'});

		API.addTrialSets(basicTrialSets);

		/**
		 *	Stimulus Sets
		 */

		//Basic stimuli
		API.addStimulusSets({
			// This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place
			Default: [
				{css:{color:piCurrent.fontColor,'font-size':'2em'}}
			],

			instructions: [
				{css:{'font-size':'1.4em',color:'black', lineHeight:1.2}, nolog:true, 
					location: {left:0,top:0}, size:{width:piCurrent.instWidth}}
			],

			target: [{
				data : {handle:'targetStim'}
			}],
			att1 :
			[{
				data: {alias:att1.name},
				inherit : 'target',
				css:att1.stimulusCss,
				media : {inherit:{type:'exRandom',set:'att1'}}
			}],
			att2 :
			[{
				data: {alias:att2.name},
				inherit : 'target',
				css:att2.stimulusCss,
				media : {inherit:{type:'exRandom',set:'att2'}}
			}],
			cat1 :
			[{
				data: {alias:cat1.name},
				inherit : 'target',
				css:cat1.stimulusCss,
				media : {inherit:{type:'exRandom',set:'cat1'}}
			}],
			cat2 :
			[{
				data: {alias:cat2.name},
				inherit : 'target',
				css:cat2.stimulusCss,
				media : {inherit:{type:'exRandom',set:'cat2'}}
			}],
			// this stimulus used for giving feedback, in this case only the error notification
			error : [{
				handle:'error', location: {top: 75}, css:{color:'red','font-size':'4em'}, media: {word:'X'}, nolog:true
			}],

			touchInputStimuli: [
				{media:{html:'<div></div>'}, size:{height:48,width:30},css:{background:'#00FF00', opacity:0.3, zindex:-1}, location:{right:0}, data:{handle:'right'}},
				{media:{html:'<div></div>'}, size:{height:48,width:30},css:{background:'#00FF00', opacity:0.3, zindex:-1}, location:{left:0}, data:{handle:'left'}}
			]
		});

		/**
		 *	Media Sets
		 */
		API.addMediaSets({
			att1 : att1.stimulusMedia, att2 : att2.stimulusMedia,
			cat1 : cat1.stimulusMedia, cat2 : cat2.stimulusMedia
		});

		/**
		 *	Create the Task sequence
		 */

		//helper Function for getting the instructions HTML.
		function getInstFromTemplate(params)
		{//params: instTemplate, blockNum, nBlocks, leftCat, rightCat, leftAtt, rightAtt.
			var retText = params.instTemplate
				.replace(/leftCategory/g, params.leftCategory)
				.replace(/rightCategory/g, params.rightCategory)
				.replace(/leftAttribute/g, params.leftAttribute)
				.replace(/rightAttribute/g, params.rightAttribute)
				.replace(/blockNum/g, params.blockNum)
				.replace(/nBlocks/g, params.nBlocks);
			return retText;
		}

		//Helper function to create the trial's layout
		function getLayout(params)
		{

			function buildContent(layout){
				if (!layout){return '';}
				var isImage = !!layout.image;
				var content = layout.word || layout.html || layout.image || layout;
				if (_.isString(layout) || layout.word) {content = _.escape(content);}
				return isImage ? '<img src="' + piCurrent.base_url.image + content + '" />' : content;
			}

			function buildStyle(css){
				css || (css = {});
				var style = '';
				for (var i in css) {style += i + ':' + css[i] + ';';}
				return style;
			}

			var template = '' +
			'   <div style="margin:0 1em; text-align:center"> '  +
			'   	<div style="font-size:0.8em; <%= stimulusData.keysCss %>; visibility:<%= stimulusData.isTouch ? \'hidden\' : \'visible\' %>">  '  +
			'   		<%= stimulusData.isLeft ? stimulusData.leftKeyText : stimulusData.rightKeyText %>  '  +
			'   	</div>  '  +
			'     '  +
			'   	<div style="font-size:1.3em;<%= stimulusData.firstCss %>">  '  +
			'   		<%= stimulusData.first %>  '  +
			'   	</div>  '  +
			'     '  +
			'   	<% if (stimulusData.second) { %>  '  +
			'   		<div style="font-size:2.3em; <%= stimulusData.orCss %>"><%= stimulusData.orText %> </div>  '  +
			'   		<div style="font-size:1.3em; max-width:100%; <%= stimulusData.secondCss %>">  '  +
			'   			<%= stimulusData.second %>  '  +
			'   		</div>  '  +
			'   	<% } %>  '  +
			'   </div>  ';

			//Attributes are above the categories.
			var layout = [
				{
					location:{left:0, top:0},
					media:{html:template},
					data: {
						first: buildContent(_.get(params, 'left1.title.media')),
						firstCss: buildStyle(_.get(params, 'left1.title.css')),
						second: buildContent(_.get(params, 'left2.title.media')),
						secondCss: buildStyle(_.get(params, 'left2.title.css')),
						leftKeyText : buildContent(_.get(piCurrent, 'leftKeyText')), 
						rightKeyText : buildContent(_.get(piCurrent, 'rightKeyText')), 
						keysCss : buildStyle(_.get(piCurrent, 'keysCss')), 
						orText : buildContent(_.get(piCurrent, 'orText')), 
						orCss : buildStyle(_.get(piCurrent, 'orCss')), 
						isTouch: isTouch,
						isLeft: true
					}
				},
				{
					location:{right:0, top:0},
					media:{html:template},
					data: {
						first: buildContent(_.get(params, 'right1.title.media')),
						firstCss: buildStyle(_.get(params, 'right1.title.css')),
						second: buildContent(_.get(params, 'right2.title.media')),
						secondCss: buildStyle(_.get(params, 'right2.title.css')),
						leftKeyText : buildContent(_.get(piCurrent, 'leftKeyText')), 
						rightKeyText : buildContent(_.get(piCurrent, 'rightKeyText')), 
						keysCss : buildStyle(_.get(piCurrent, 'keysCss')), 
						orText : buildContent(_.get(piCurrent, 'orText')), 
						orCss : buildStyle(_.get(piCurrent, 'orCss')), 
						isTouch: isTouch,
						isLeft: false
					}
				}
			];

			if (!params.isInst && params.remindError)
			{
				layout.push({
					location: {bottom:1},
					media: {html: isTouch ? params.remindErrorTextTouch : params.remindErrorText}
				});
			}

			if (!params.isInst && isTouch){
				layout.push({inherit:{type:'byData', set:'touchInputStimuli', data:{handle:'right'}}});
				layout.push({inherit:{type:'byData', set:'touchInputStimuli', data:{handle:'left'}}});
			}

			return layout;
		}

		//helper function for creating an instructions trial
		function getInstTrial(params)
		{
			var instParams = {isInst : true};
			//The names of the category and attribute labels.
			if (params.nCats == 2)
			{//When there are only two categories in the block, one two of these will appear in the instructions.
				instParams.leftAttribute = params.left1.name;
				instParams.rightAttribute = params.right1.name;
				instParams.leftCategory = params.left1.name;
				instParams.rightCategory = params.right1.name;
			}
			else
			{
				instParams.leftAttribute = params.left1.name;
				instParams.rightAttribute = params.right1.name;
				instParams.leftCategory = params.left2.name;
				instParams.rightCategory = params.right2.name;
			}
			_.extend(instParams, params);
			var instLocation={bottom:1};
			if (isTouch == true)
			{
				instLocation={left:0,top:(params.nCats == 2) ? 7 : 10};
			}
			var instTrial = {
				inherit : 'instructions',
				data: {blockStart:true},
				layout : getLayout(instParams),
				stimuli : [
					{
						inherit : 'instructions',
						media : {html : getInstFromTemplate(instParams)},
						location : instLocation,
						nolog:true
					},
					{
						data : {handle:'dummy', alias:'dummy'},
						media : {word:' '},
						location : {top:1}
					}
				]
			};

			return instTrial;
		}

		//Get a mixer for a mini-block in a 2-categories block.
		function getMiniMixer2(params)
		{//{nTrialsInMini : , currentCond : , rightTrial : , leftTrial : , blockNum : , blockLayout : )
			var mixer = {
				mixer : 'repeat',
				times : params.nTrialsInMini/2,
				data :
				[
					{
						inherit : params.rightTrial,
						data : {condition : params.currentCond, block : params.blockNum},
						layout : params.blockLayout
					},
					{
						inherit : params.leftTrial,
						data : {condition : params.currentCond, block : params.blockNum},
						layout : params.blockLayout
					}
				]
			};
			return ({
				mixer : 'random',
				data : 	[mixer] //Completely randomize the repeating trials.
			});
		}

		//Get a mixer for a mini-block in a 4-categories block.
		function getMiniMixer4(params)
		{//{nTrialsInMini : , currentCond : , rightTrial1 : , leftTrial1 : , rightTrial2 : , leftTrial2 : , blockNum : , blockLayout : )

			////Because of the alternation, we randomize the trial order ourselves.
			var atts = [];
			var cats = [];
			var iTrial;

			//Fill
			for (iTrial = 1; iTrial <= params.nTrialsInMini; iTrial+=4)
			{
				atts.push(1);
				atts.push(2);
				cats.push(1);
				cats.push(2);
			}
			//Randomize order
			atts = _.shuffle(atts);
			cats = _.shuffle(cats);

			var mixerData = [];
			var iCat = 0;
			var iAtt = 0;
			for (iTrial = 1; iTrial <= params.nTrialsInMini; iTrial+=2)
			{
				mixerData.push(
				{
					inherit : (cats[iCat] == 1) ? params.leftTrial2 : params.rightTrial2,
					data : {condition : params.currentCond, block : params.blockNum},
						layout : params.blockLayout
				});
				iCat++;
				mixerData.push(
				{
					inherit : (atts[iAtt] == 1) ? params.leftTrial1 : params.rightTrial1,
					data : {condition : params.currentCond, block : params.blockNum},
						layout : params.blockLayout
				});
				iAtt++;
			}

			return ({
				mixer : 'wrapper',
				data : mixerData
			});
		}

		////////////////////////////////////////////////////////////////
		////AFTER ALL the helper functions, it is time to create the trial sequence.
		var trialSequence = [];

		var globalObj = piCurrent;

        //Count the number of blocks in this task
        var nBlocks = (globalObj.blockAttributes_nTrials<1 ? 0 : 1) + 
        (globalObj.blockCategories_nTrials<1 ? 0 : 1) + 
        (globalObj.blockFirstCombined_nTrials<1 ? 0 : 2) + 
        (globalObj.blockSecondCombined_nTrials<1 ? 0 : 2) + 
        (globalObj.blockSwitch_nTrials<1 ? 0 : 1);

		//These parameters are used to create trials.
		var blockParamsAtts = {
			nBlocks : nBlocks,
			remindError : globalObj.remindError,
			remindErrorText : globalObj.remindErrorText,
			remindErrorTextTouch : globalObj.remindErrorTextTouch
		};
		//////////////////////////////
		////Block 1: Categories block
		var iBlock = 1;
		var blockParamsCats = {
			nBlocks : nBlocks,
			remindError : globalObj.remindError,
			remindErrorText : globalObj.remindErrorText,
			remindErrorTextTouch : globalObj.remindErrorTextTouch
		};
		//Set sides
		var rightCatName = (globalObj.randomBlockOrder ? (Math.random() >= 0.5 ? cat1.name : cat2.name) : cat2.name);
		var leftCatTrial = 'cat1left';
		blockParamsCats.left1 = cat1;
		var rightCatTrial = 'cat2right';
		blockParamsCats.right1 = cat2;
		if (rightCatName == cat1.name)
		{
			blockParamsCats.right1 = cat1;
			rightCatTrial = 'cat1right';
			blockParamsCats.left1 = cat2;
			leftCatTrial = 'cat2left';
		}
		var blockCondition = blockParamsCats.left1.name + ',' + blockParamsCats.right1.name;
		blockParamsCats.nMiniBlocks = globalObj.blockCategories_nMiniBlocks;
		blockParamsCats.nTrials = globalObj.blockCategories_nTrials;
		blockParamsCats.blockNum = iBlock;
		blockParamsCats.nCats = 2;
		blockParamsCats.instTemplate = isTouch ? globalObj.instCategoriesPracticeTouch : globalObj.instCategoriesPractice;

		var blockLayout = getLayout(blockParamsCats);
		var nTrialsInMini = blockParamsCats.nTrials/blockParamsCats.nMiniBlocks;
		var iBlock2Mini;
		
		//Add trials, but only if there are trials in this block
		if (blockParamsCats.nTrials > 0)
		{
    		trialSequence.push(getInstTrial(blockParamsCats));
    		for (iBlock2Mini = 1; iBlock2Mini <= blockParamsCats.nMiniBlocks; iBlock2Mini++)
    		{
    			trialSequence.push(getMiniMixer2({
    			nTrialsInMini : nTrialsInMini, currentCond : blockCondition,
    			rightTrial : rightCatTrial, leftTrial : leftCatTrial, blockNum : iBlock,
    			blockLayout : blockLayout}));
    		}
    		iBlock++;
		}
		
		//////////////////////////////
		////Block 2: Attributes
		//Set variables related to the sides
		blockParamsAtts.left1 = att1;
		blockParamsAtts.right1 = att2;
		//Names of the trials in this block
		var leftAttTrial = 'att1left';
		var rightAttTrial = 'att2right';
		if (rightAttName == att1.name)
		{
			blockParamsAtts.right1 = att1;
			rightAttTrial = 'att1right';
			leftAttTrial = 'att2left';
			blockParamsAtts.left1 = att2;
		}
		//Set the block's condition
		blockCondition = blockParamsAtts.left1.name + ',' + blockParamsAtts.right1.name;
		//Number variables
		blockParamsAtts.nMiniBlocks = globalObj.blockAttributes_nMiniBlocks;
		blockParamsAtts.nTrials = globalObj.blockAttributes_nTrials;
		blockParamsAtts.blockNum = iBlock;
		blockParamsAtts.nCats = 2;
		//Instructions trial
		blockParamsAtts.instTemplate = isTouch ? globalObj.instAttributePracticeTouch : globalObj.instAttributePractice;
		//Layout for the sorting trials
		blockLayout = getLayout(blockParamsAtts);
		//Number of trials in a mini block.
		nTrialsInMini = blockParamsAtts.nTrials/blockParamsAtts.nMiniBlocks;
		//Add a mixer for each mini block.
		var iBlock1Mini;
		if (blockParamsAtts.nTrials > 0)
		{
    		trialSequence.push(getInstTrial(blockParamsAtts));
    		for (iBlock1Mini = 1; iBlock1Mini <= blockParamsAtts.nMiniBlocks; iBlock1Mini++)
    		{
    			trialSequence.push(getMiniMixer2(
    			{nTrialsInMini : nTrialsInMini, currentCond : blockCondition,
    			rightTrial : rightAttTrial, leftTrial : leftAttTrial, blockNum : iBlock,
    			blockLayout : blockLayout}));
    		}
    		iBlock++;
		}
		//////////////////////////////
		////Block 3: First combined block
		var blockParamsCombined = {
			nBlocks : nBlocks,
			remindError : globalObj.remindError,
			remindErrorText : globalObj.remindErrorText,
			remindErrorTextTouch : globalObj.remindErrorTextTouch
		};
		//We get the categories from the first two blocks.
		blockParamsCombined.right1 = blockParamsAtts.right1;
		blockParamsCombined.left1 = blockParamsAtts.left1;
		blockParamsCombined.right2 = blockParamsCats.right1;
		blockParamsCombined.left2 = blockParamsCats.left1;
		blockCondition = blockParamsCombined.left2.name + '/' + blockParamsCombined.left1.name + ',' + blockParamsCombined.right2.name + '/' + blockParamsCombined.right1.name;
		//We will send the condition of the third block to the server at the end.
		var block3Cond = blockCondition;
		//Number variables.
		blockParamsCombined.nMiniBlocks = globalObj.blockFirstCombined_nMiniBlocks;
		blockParamsCombined.nTrials = globalObj.blockFirstCombined_nTrials;
		blockParamsCombined.blockNum = iBlock;
		blockParamsCombined.nCats = 4;
		//Instructions trial.
		blockParamsCombined.instTemplate = isTouch ? globalObj.instFirstCombinedTouch : globalObj.instFirstCombined;
		//Get the layout for the sorting trials.
		blockLayout = getLayout(blockParamsCombined);
		//Fill the trials.
		nTrialsInMini = blockParamsCombined.nTrials/blockParamsCombined.nMiniBlocks;
		var iBlock3Mini;
		
		if (blockParamsCombined.nTrials > 0)
		{
    		trialSequence.push(getInstTrial(blockParamsCombined));
    		for (iBlock3Mini = 1; iBlock3Mini <= blockParamsCombined.nMiniBlocks; iBlock3Mini++)
    		{
    			trialSequence.push(getMiniMixer4({
    			nTrialsInMini : nTrialsInMini, currentCond : blockCondition,
    			rightTrial1 : rightAttTrial, leftTrial1 : leftAttTrial,
    			rightTrial2 : rightCatTrial, leftTrial2 : leftCatTrial,
    			blockNum : iBlock, blockLayout : blockLayout}));
    		}
			iBlock++;
		}
		//////////////////////////////
		////Second combined block.
		blockParamsCombined.blockNum = iBlock;
		blockParamsCombined.nMiniBlocks = globalObj.blockSecondCombined_nMiniBlocks;
		blockParamsCombined.nTrials = globalObj.blockSecondCombined_nTrials;
		//Instructions trial.
		blockParamsCombined.instTemplate = isTouch ? globalObj.instSecondCombinedTouch : globalObj.instSecondCombined;
		//The layout for the sorting trials.
		blockLayout = getLayout(blockParamsCombined);
		//Fill the trials
		nTrialsInMini = blockParamsCombined.nTrials/blockParamsCombined.nMiniBlocks;
		var iBlock4Mini;
		if (blockParamsCombined.nTrials > 0)
		{
			trialSequence.push(getInstTrial(blockParamsCombined));
			for (iBlock4Mini = 1; iBlock4Mini <= blockParamsCombined.nMiniBlocks; iBlock4Mini++)
			{
				trialSequence.push(getMiniMixer4({
				nTrialsInMini : nTrialsInMini, currentCond : blockCondition,
				rightTrial1 : rightAttTrial, leftTrial1 : leftAttTrial,
				rightTrial2 : rightCatTrial, leftTrial2 : leftCatTrial,
				blockNum : iBlock, blockLayout : blockLayout}));
			}
		    iBlock++;
		}
		//////////////////////////////
		////Switch categories side block.
		//Do the switch
		blockParamsCats.right1 = blockParamsCombined.left2;
		blockParamsCats.left1 = blockParamsCombined.right2;
		rightCatTrial = (rightCatTrial == 'cat1right') ? 'cat2right' : 'cat1right';
		leftCatTrial = (leftCatTrial == 'cat1left') ? 'cat2left' : 'cat1left';
		blockParamsCats.instTemplate = isTouch ? globalObj.instSwitchCategoriesTouch : globalObj.instSwitchCategories;
		//Get numbers
		blockParamsCats.nMiniBlocks = globalObj.blockSwitch_nMiniBlocks;
		blockParamsCats.nTrials = globalObj.blockSwitch_nTrials;
		//The rest is like blocks 1 and 2.
		blockCondition = blockParamsCats.left1.name + ',' + blockParamsCats.right1.name;
		blockParamsCats.blockNum = iBlock;
		blockParamsCats.nCats = 2;
		//The layout for the sorting trials.
		blockLayout = getLayout(blockParamsCats);
		//Fill the trials.
		nTrialsInMini = blockParamsCats.nTrials/blockParamsCats.nMiniBlocks;
		var iBlock5Mini;
		if (blockParamsCats.nTrials > 0)
		{
    		trialSequence.push(getInstTrial(blockParamsCats));
    		for (iBlock5Mini = 1; iBlock5Mini <= blockParamsCats.nMiniBlocks; iBlock5Mini++)
    		{
    			trialSequence.push(getMiniMixer2({
    			nTrialsInMini : nTrialsInMini, currentCond : blockCondition,
    			rightTrial : rightCatTrial, leftTrial : leftCatTrial, blockNum : iBlock,
    			blockLayout : blockLayout}));
    		}
    		iBlock++;
		}
		//////////////////////////////
		////The other combined block
		//Get the categories side from the switch block.
		blockParamsCombined.right2 = blockParamsCats.right1;
		blockParamsCombined.left2 = blockParamsCats.left1;
		blockCondition = blockParamsCombined.left2.name + '/' + blockParamsCombined.left1.name + ',' + blockParamsCombined.right2.name + '/' + blockParamsCombined.right1.name;
		//Number variables.
		blockParamsCombined.nMiniBlocks = globalObj.blockFirstCombined_nMiniBlocks;
		blockParamsCombined.nTrials = globalObj.blockFirstCombined_nTrials;
		blockParamsCombined.blockNum = iBlock;
		blockParamsCombined.nCats = 4;
		//Instruction trial.
		blockParamsCombined.instTemplate = isTouch ? globalObj.instFirstCombinedTouch : globalObj.instFirstCombined;
		if (globalObj.instThirdCombined != 'instFirstCombined')
		{
			blockParamsCombined.instTemplate = isTouch ? globalObj.instThirdCombinedTouch : globalObj.instThirdCombined;
		}
		//Layout for the sorting trials.
		blockLayout = getLayout(blockParamsCombined);
		//Fill the trials.
		nTrialsInMini = blockParamsCombined.nTrials/blockParamsCombined.nMiniBlocks;
		var iBlock6Mini;
		if (blockParamsCombined.nTrials > 0)
		{
    		trialSequence.push(getInstTrial(blockParamsCombined));
    		for (iBlock6Mini = 1; iBlock6Mini <= blockParamsCombined.nMiniBlocks; iBlock6Mini++)
    		{
    			trialSequence.push(getMiniMixer4({
    			nTrialsInMini : nTrialsInMini, currentCond : blockCondition,
    			rightTrial1 : rightAttTrial, leftTrial1 : leftAttTrial,
    			rightTrial2 : rightCatTrial, leftTrial2 : leftCatTrial,
    			blockNum : iBlock, blockLayout : blockLayout}));
    		}
			iBlock++;
		}
		//////////////////////////////
		////Second combined block.
		//Fourth block is another combined block.
		blockParamsCombined.blockNum = iBlock;
		blockParamsCombined.nMiniBlocks = globalObj.blockSecondCombined_nMiniBlocks;
		blockParamsCombined.nTrials = globalObj.blockSecondCombined_nTrials;
		//Instructions trial.
		blockParamsCombined.instTemplate = isTouch ? globalObj.instSecondCombinedTouch : globalObj.instSecondCombined;
		if (globalObj.instFourthCombined != 'instSecondCombined')
		{
			blockParamsCombined.instTemplate = isTouch ? globalObj.instFourthCombinedTouch : globalObj.instFourthCombined;
		}
		//Layout for sorting trials.
		blockLayout = getLayout(blockParamsCombined);
		//Fill the trials.
		nTrialsInMini = blockParamsCombined.nTrials/blockParamsCombined.nMiniBlocks;
		var iBlock7Mini;
		if (blockParamsCombined.nTrials > 0)
		{
			trialSequence.push(getInstTrial(blockParamsCombined));
			for (iBlock7Mini = 1; iBlock7Mini <= blockParamsCombined.nMiniBlocks; iBlock7Mini++)
			{
				trialSequence.push(getMiniMixer4({
				nTrialsInMini : nTrialsInMini, currentCond : blockCondition,
				rightTrial1 : rightAttTrial, leftTrial1 : leftAttTrial,
				rightTrial2 : rightCatTrial, leftTrial2 : leftCatTrial,
				blockNum : iBlock, blockLayout : blockLayout}));
			}
		}
		//////////////////////////////
		//Add final trial
		trialSequence.push({
			inherit : 'instructions',
			data: {blockStart:true},
			layout : [{media:{word:''}}],
			stimuli : [
				{
					inherit : 'Default',
					media : {word : (isTouch ? piCurrent.finalTouchText : piCurrent.finalText)}
				}
			]
		});

		//Add the trials sequence to the API.
		API.addSequence(trialSequence);

		/**
		*Compute scores and feedback messages
		**/
		var errorLatencyUse = piCurrent.errorCorrection ? 'latency' : 'penalty';
		//Settings for the score computation.
		scorer.addSettings('compute',{
			ErrorVar:'score',
			condVar:'condition',
			//condition 1
			cond1VarValues: [
				cat1.name + '/' + att1.name + ',' + cat2.name + '/' + att2.name,
				cat2.name + '/' + att2.name + ',' + cat1.name + '/' + att1.name
			],
			//condition 2
			cond2VarValues: [
				cat2.name + '/' + att1.name + ',' + cat1.name + '/' + att2.name,
				cat1.name + '/' + att2.name + ',' + cat2.name + '/' + att1.name
			],
			parcelVar : "parcel", //We use only one parcel because it is probably not less reliable.
			parcelValue : ['first'],
			fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
			maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
			minRT : 400, //Below this latency
			maxRT : 10000, //above this
			errorLatency : {use:errorLatencyUse, penalty:600, useForSTD:true},
			postSettings : {score:"score",msg:"feedback",url:"/implicit/scorer"}
		});

		//Helper function to set the feedback messages.
		function getFB(inText, categoryA, categoryB, att1, att2)
		{
			var retText = inText.replace(/attribute1/g, att1);
			retText = retText.replace(/attribute2/g, att2);
			retText = retText.replace(/categoryA/g, categoryA);
			retText = retText.replace(/categoryB/g, categoryB);
			return retText;
		}

        //Updated in May, 2023.
        //Let's show in the feedback the title used in the actual IAT, unless it was not defined (e.g., it was an image)
        //let cat1Name = cat1?.title?.word || cat1.name;
        //let cat2Name = cat2?.title?.word || cat2.name;
        let cat1Name = (cat1.title == null || cat1.title.media.word == null) ? cat1.name : cat1.title.media.word;
        let cat2Name = (cat2.title == null || cat2.title.media.word == null) ? cat2.name : cat2.title.media.word;
        let att1Name = (att1.title == null || att1.title.media.word == null) ? att1.name : att1.title.media.word;
        let att2Name = (att2.title == null || att2.title.media.word == null) ? att2.name : att2.title.media.word;
		//Set the feedback messages.
		var messageDef = [
				{ cut:'-0.65', message : getFB(piCurrent.fb_strong_Att1WithCatA_Att2WithCatB, cat1Name, cat2Name, att1Name, att2Name) },
				{ cut:'-0.35', message : getFB(piCurrent.fb_moderate_Att1WithCatA_Att2WithCatB, cat1Name, cat2Name, att1Name, att2Name) },
				{ cut:'-0.15', message : getFB(piCurrent.fb_slight_Att1WithCatA_Att2WithCatB, cat1Name, cat2Name, att1Name, att2Name) },
				{ cut:'0.15', message : getFB(piCurrent.fb_equal_CatAvsCatB, cat1Name, cat2Name, att1Name, att2Name) },
				{ cut:'0.35', message : getFB(piCurrent.fb_slight_Att1WithCatA_Att2WithCatB, cat2Name, cat1Name, att1Name, att2Name) },
				{ cut:'0.65', message : getFB(piCurrent.fb_moderate_Att1WithCatA_Att2WithCatB, cat2Name, cat1Name, att1Name, att2Name) },
				{ cut:'5', message : getFB(piCurrent.fb_strong_Att1WithCatA_Att2WithCatB, cat2Name, cat1Name, att1Name, att2Name) }
		];

		var scoreMessageObject = { MessageDef : messageDef };
		if (piCurrent.manyErrors !== '')
		{
			scoreMessageObject.manyErrors = piCurrent.manyErrors;
		}
		if (piCurrent.tooFast !== '')
		{
			scoreMessageObject.tooFast = piCurrent.tooFast;
		}
		if (piCurrent.notEnough !== '')
		{
			scoreMessageObject.notEnough = piCurrent.notEnough;
		}
		//Set messages to the scorer.
		scorer.addSettings('message',scoreMessageObject);

		return API.script;
	}

	return iatExtension;
});
