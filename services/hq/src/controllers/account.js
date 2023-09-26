const Joi = require("joi");
const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
const account = require("../services/account");
const { AddAccount, ShowAccount } = account;

//add account
const add_account = async (req, res, next) => {
  try {
    const schema = Joi.object({
      client_id: Joi.string().required(),
      user_name: Joi.string().required(),
      password: Joi.string()
        .required()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z]).{10,18}$/),
      status: Joi.string().required(),
      account_type: Joi.string().required(),
    });
    const account = {
      client_id: req.body.client_id,
      user_name: req.body.user_name,
      account_type : req.body.account_type,
      password: req.body.password,
      status: req.body.status,
    };
    const validatedBody = schema.validate(account);
    if (validatedBody.error) {
      console.log("i am validated body", validatedBody.error);
      res.status(403).send({
        message: validatedBody.error.message,
      });
    } else {
      const query = validatedBody.value;
      const added_account = await AddAccount(query)
        .then((result) => {
          res.status(200).send({
            message: "account created",
            result: result,
          });
        })
        .catch((err) => {
          res.status(400).send({
            err: err.message,
          });
        });
      
    }
  } catch (e) {
    console.log("error", e);
    return next(e);
  }
};

//show account
const show_account = async(req,res,next) => {
    try {
        // const schema = Joi.object({
        //   client_id: Joi.string().required(),
        //   user_name: Joi.string().required(),
        //   password: Joi.string()
        //     .required()
        //     .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z]).{10,18}$/),
        //   status: Joi.string().required(),
        // });
        // const account = {
        //   client_id: req.body.client_id,
        //   user_name: req.body.account,
        //   password: req.body.password,
        //   status: req.body.status,
        // };
        // const validatedBody = schema.validate(account);
        // if (validatedBody.error) {
        //   console.log("i am validated body", validatedBody.error);
        //   res.status(403).send({
        //     message: validatedBody.error.message,
        //   });
        // } else {
          const query = {} ;//validatedBody.value;
          const added_client = await ShowAccount(query)
            .then((result) => {
              res.status(200).send({
                message: "client created",
                result: result,
              });
            })
            .catch((err) => {
              res.status(400).send({
                err: err.message,
              });
            });
          //console.log("added_client.error", added_client);
        //}
      } catch (e) {
        console.log("error", e);
        return next(e);
      }

}

module.exports = {
    add_account : add_account,
    show_account : show_account
}