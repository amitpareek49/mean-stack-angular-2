const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = 
{
	uri: 'mongodb://amitnitt:AMIT533185@ds155315.mlab.com:55315/mymondodb',
	secret: crypto,
	db: 'mymondodb'
}