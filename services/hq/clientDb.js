
let smObj = {
    Client : {
        //we need first name,last name,so is client_name required ?
        client_name: {
            type: String,
            required : true,
        },
        parent_client_id: {
            type: String,
            default: null,
            isObjectId: true,
        },
        contact: {
            type: String,
            default : null,
        },
        email: {
            type: String,
            default : null,
        },
        username: {
            type: String,
            required : true,
        },
        password: {
            type: String,
            required : true,
        },
        status: {
            type: String,
            default : "online",
            required : true,
        },
        environment: {
            type: String,
            default : "staging",
            required : true,
        },
        created_by : {
            type: String,
            default : null
        },
        updated_by : {
            type: String,
            default : null
        },
        created_at: {
            type: Date,
            default: ""
        },
        updated_at: {
            type: Date,
            default: ""
        }
    }
}