

module.exports = {

  getOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  },
  dateTime() {
    var today = new Date(new Date() - new Date().getTimezoneOffset() * 60 * 1000).toISOString();
    var check = "";
    check = today.split(".")[0].split("T")
    var time = check[1].split(":")[0] > "11" ? " PM" : " AM"
    check = check[0].split("-").reverse().join("/") + " " + check[1] + time;
    return check
  },
  findCommonElements(arr1, arr2) {
    const commonElements = [];

    for (const element of arr1) {
      if (arr2.includes(element)) {
        commonElements.push(element);
      }
    }

    return commonElements;
  },
  findWinAmount(){

  }
  // getToken: async (payload) => {
  //   var token = await jwt.sign(payload, config.get('jwtsecret'), { expiresIn: 86400 })
  //   return token;
  // }
}
