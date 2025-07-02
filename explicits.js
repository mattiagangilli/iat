define(['questAPI'], function(Quest){ 
    let API = new Quest();
    let isTouch = API.getGlobal().$isTouch;

    /**
     * Page prototype
     */
    API.addPagesSet('basicPage',{
        noSubmit:false,
        header: 'Questionario',
        decline: true,
        declineText: isTouch ? 'Rifiuta' : 'Preferisco non rispondere', 
        autoFocus:true, 
        progressBar: 'Pagina <%= pagesMeta.number %> di 1'
    });

    /**
     * Question prototypes
     */
    API.addQuestionsSet('basicQ',{
        decline: 'true',
        required : true,
        errorMsg: {
            required: isTouch 
                ? 'Seleziona una risposta o clicca su "Rifiuta"' 
                : 'Seleziona una risposta o clicca su "Preferisco non rispondere"'
        },
        autoSubmit:'true',
        numericValues:'true'
    });

    API.addQuestionsSet('basicSelect', {
        inherit: 'basicQ',
        type: 'selectOne'
    });

    API.addQuestionsSet('basicDropdown', {
        inherit: 'basicQ',
        type: 'dropdown',
        autoSubmit: false
    });

    /**
     * Sesso e Età
     */
    API.addQuestionsSet('gender', {
        inherit: 'basicSelect',
        name: 'gender',
        stem: 'Qual è il tuo sesso?',
        answers: [
            {text: 'Maschio', value: 'male'},
            {text: 'Femmina', value: 'female'},
            {text: 'Altro', value: 'other'}
        ]
    });

    API.addQuestionsSet('age', {
        inherit: 'basicDropdown',
        name: 'age',
        stem: 'Quanti anni hai?',
        answers: (function(){
            let ans = [];
            for (let i = 10; i <= 100; i++) {
                ans.push({text: i.toString(), value: i});
            }
            return ans;
        })()
    });

    /**
     * Sequenza del questionario
     */
    API.addSequence([
        {
            inherit: 'basicPage',
            questions: [
                {inherit: 'gender'},
                {inherit: 'age'}
            ]
        }
    ]);

    return API.script;
});
