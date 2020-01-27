module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('salt',{
        'email' : {
            type : DataTypes.STRING(30),
            unique : true,
            allowNull : false
        },
        'salt' : {
            type : DataTypes.STRING(100),
            allowNull : false
        }
    },{
        timestamps: false
    })
}