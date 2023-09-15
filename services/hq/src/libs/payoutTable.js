// 0,4,5,6,7,8
// 1,3,6,18,120
let payOut = async (req,res,next)=>{
    const payoutJson = {
        "0" : "1",
        "4" : "3",
        "5" : "6",
        "6" : "18",
        "7" : "120",
        "8" : "1800",
        "9" : "4200",
        "10": "5000"
    };
    let payOutAmount ;
    const payoutObject = JSON.parse(payoutJson);
    const keys = payoutObject.keys();
    const quickPick = req.body.quickPick;
    for(q of keys){
        if(quickPick == keys)
        payOutAmount = payoutObject.quickPick ;
    
    } 
    
    return res.status(200).send({
        payOutAmount : payOutAmount,
        error : false
    
    })

}


