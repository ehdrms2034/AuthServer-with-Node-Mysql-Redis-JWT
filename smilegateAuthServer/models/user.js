module.exports = (sequelize, DataTypes)=>{
    return sequelize.define('user',{
        email : {
            type : DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        password : {
            type : DataTypes.STRING(100),
            allowNull: false,
        },
        name : {
            type : DataTypes.STRING(15),
            allowNull : false,
        },
        verified : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        userType : {
            type : DataTypes.STRING(10),
            allowNull : false,
            defaultValue : "User"
        }
    },{
        timestamps: true,
    });
}