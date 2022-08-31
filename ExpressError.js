class ExpressError extends Error {
  constructor(messsage, statusCode) {
    super();
    this.message= messsage;
    this.status = statusCode;
  }
}
 module.exports= ExpressError;