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
        progressBar: 'Pagina <%= pagesMeta.number %> di 1',
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
     * Sesso
     */
    API.addQuestionsSet('gender', {
        inherit: 'basicSelect',
        name: 'gender',
        stem: 'Come descriveresti la tua identità di genere?',
        answers: [
            {text: 'Uomo', value: 'male'},
            {text: 'Donna', value: 'female'},
            {text: 'Non binario/Di genere non conforme', value: 'other'}
        ]
    });

    /**
     * Età
     */
    API.addQuestionsSet('age', {
        inherit: 'basicDropdown',
        name: 'age',
        stem: 'Quanti anni hai?',
        answers: (function(){
            let ans = [];
            for (let i = 18; i <= 100; i++) {
                ans.push({text: i.toString(), value: i});
            }
            return ans;
        })()
    });

    /**
     * Etnia/Razza
     */
    API.addQuestionsSet('ethnicity', {
        inherit: 'basicQ',
        type: 'selectMulti',
        name: 'ethnicity',
        stem: 'Come descriveresti la tua razza o etnia? Seleziona tutte le opzioni che si applicano e fornisci dettagli nello spazio sottostante. Puoi indicare più di un gruppo.',
        answers: [
            {text: 'Bianco', value: 'white', open: true, openText: 'Specifica'},
            {text: 'Ispanico, Latino o Spagnolo', value: 'hispanic', open: true, openText: 'Specifica'},
            {text: 'Nero o Afroamericano', value: 'black', open: true, openText: 'Specifica'},
            {text: 'Asiatico', value: 'asian', open: true, openText: 'Specifica'},
            {text: 'Nativo americano o nativo dell\'Alaska', value: 'native_american', open: true, openText: 'Specifica'},
            {text: 'Mediorientale o nordafricano', value: 'mena', open: true, openText: 'Specifica'},
            {text: 'Nativo hawaiano o di altre isole del Pacifico', value: 'pacific_islander', open: true, openText: 'Specifica'},
            {text: 'Altra razza o etnia', value: 'other', open: true, openText: 'Specifica'}
        ]
    });

    /**
     * Sequenza del questionario (una sola pagina)
     */
    API.addSequence([
        {
            inherit: 'basicPage',
            questions: [
                {inherit: 'gender'},
                {inherit: 'age'},
                {inherit: 'ethnicity'}
            ]
        }
    ]);

    return API.script;
});
