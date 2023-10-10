module.exports = {
     mongoURI: process.env.MONGO_URI, 
     jwt: process.env.JWT,
     rootDir: `${process.env.NODE_ENV === 'production' ? '../../../../' : '../'}` 
}   