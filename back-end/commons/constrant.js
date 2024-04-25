const TYPE_RULE = {
    GENERAL: 'GENERAL',
    INITIAL: 'INITIAL',
    DEBT: 'DEBT',
    FIN_SAVING: 'FIN_SAVING',
    FIN_INVEST: 'FIN_INVEST'
}

module.exports = {
    TYPE_RULE: TYPE_RULE,
    questionnaire: [
        {
            order: 1,
            key: TYPE_RULE.GENERAL,
            type: 'fixed'
        },
        {
            order: 2,
            key: TYPE_RULE.INITIAL,
            type: 'fixed'
        },
        {
            order: 3,
            key: TYPE_RULE.DEBT,
            type: 'commit'
        },
        {
            order: 4,
            key: TYPE_RULE.FIN_SAVING,
            type: 'commit'
        },
        {
            order: 5,
            key: TYPE_RULE.FIN_INVEST,
            type: 'commit'
        },
    ],

}