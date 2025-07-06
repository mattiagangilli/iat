define(['pipAPI','iat10_trial.js'], function(APIConstructor, iatExtension){
    let API = new APIConstructor();
    let global = API.getGlobal();

    return iatExtension({
        category1 : {
            name : 'Fiori',
            title : {
                media : {word : 'Fiori'},
                css : {color:'#31940F','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : [
                {image: 'trial_bm1.jpg'},
                {image: 'trial_bm2.jpg'},
                {image: 'trial_bf1.jpg'},
                {image: 'trial_bf2.jpg'}
            ],
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },
        category2 : {
            name : 'Insetti',
            title : {
                media : {word : 'Insetti'},
                css : {color:'#31940F','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : [
                {image: 'trial_wm1.jpg'},
                {image: 'trial_wm2.jpg'},
                {image: 'trial_wf1.jpg'},
                {image: 'trial_wf2.jpg'}
            ],
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },
        attribute1 : {
            name : 'Parole Negative',
            title : {
                media : {word : 'Parole Negative'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: global.negWords[0]},
                {word: global.negWords[1]},
                {word: global.negWords[2]},
                {word: global.negWords[3]}
            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        attribute2 : {
            name : 'Parole Positive',
            title : {
                media : {word : 'Parole Positive'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: global.posWords[0]},
                {word: global.posWords[1]},
                {word: global.posWords[2]},
                {word: global.posWords[3]}
            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        base_url : { image : './images/trial/' },
        isTouch : API.getGlobal().$isTouch
    });
});
