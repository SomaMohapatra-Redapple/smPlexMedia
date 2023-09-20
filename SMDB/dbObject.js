  const smObj = {
    Account : {
        client_id: {
          type: String,
          ref: 'clients'
        },
        username: {
          type: String,
          default: ''
        },
        password: {
          type: String,
          default: null
        },
        status: {
          type: String,
          default: 'online',
          required: true
        },
        created_at: {
          type: Date,
          default: null 
        },
        updated_at: {
          type: Date,
          default: null 
        }
    },
    AccountTechnicals : {
        client_id: {
            type: String,
            ref: 'clients'
        },
        account_id: {
            type: String,
            ref: 'accounts'
        },
        api_username: {
            type: String,
            required : true,
        },
        api_secret: {
            type: String,
            required : true,
        },
        service_endpoint: {
            type: String,
            required : true,
        },
        created_at: {
            type: Date,
            default: ""
        },
        updated_at: {
            type: Date,
            default: ""
        }
    },
    Category : {
        game_provider_id: {
            type: String,
            ref: 'providers',
            required : true,
        },
        category: {
            type: String,
            required : true,
        },
        category_icon: {
            type: String,
            required : true,
        },
        category_order: {
            type: String,
            required : true,
        },
        status: {
            type: String,
            // default : "online",
            required : true,
        },
        created_at: {
            type: Date,
            default: ""
        },
        updated_at: {
            type: Date,
            default: ""
        }
    },
    Client : {
        client_name: {
            type: String,
            required : true,
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
    },
    Game : {
        game_provider_id: {
            type: String,
            ref: 'providers',
            required : true,
        },
        game_category_id: {
            type: String,
            ref: 'categories',
            required : true,
        },
        game_name: [
            Object
        ],
        game_image: {
            type: String,
            required : true,
        },
        game_code: {
            type: String,
            required : true,
        },
        is_featured: {
            type: Boolean,
            required : true,
        },
        is_jackpot: {
            type: Boolean,
            required : true,
        },
        is_popular: {
            type: Boolean,
            required : true,
        },
        is_new: {
            type: Boolean,
            required : true,
        },
        game_tag_image: {
            type: String,
            default : null,
        },
        game_type: {
            type: String,
            required : true,
        },
        game_order: {
            type: String,
            required : true,
        },
        status: {
            type: String,
            // default : "online",
            required : true,
        },
        release_date: {
            type: Date,
            required : true,
        },
        game_type_name: {
            type: String,
            required : true,
        },
        created_at: {
            type: Date,
            default: ""
        },
        updated_at: {
            type: Date,
            default: ""
        }
    },
    Player : {
        account_id: {
            type: String,
            ref: 'accounts',
        },
        account_user_id: {
            type: String,
            required : true,
        },
        username: {
            type: String,
            default : null,
        },
        currency_code: {
            type: String,
            required : true,
        },
        language_code: {
            type: String,
            required : true,
        },
        status: {
            type: String,
            // default : "online",
            required : true,
        },
        created_at: {
            type: Date,
            default: ""
        },
        updated_at: {
            type: Date,
            default: ""
        }
    },
    Provider : {
        game_provider_name: {
            type: String,
            required : true,
        },
        is_subprovider: {
            type: Boolean,  
            required : true,
            default : false,
        },
        parent_game_provider_id: {
            type: String,
            ref: 'providers',
            required : false,
        },
        status: {
            type: String,
            // default : "online",
            required : true,
        },
        created_at: {
            type: Date,
            default: ""
        },
        updated_at: {
            type: Date,
            default: ""
        }
    },
    SuperAdmin : {
        admin_name: {
            type: String,
            required : true,
        },
        contact: {
            type: String,
            default : null,
        },
        email: {
            type: String,
            required : true,
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
        created_at: {
            type: Date,
            default: ""
        },
        updated_at: {
            type: Date,
            default: ""
        }
    },
    Transaction : {
        session_id: {
            type: String,
            required : true,
        },
        account_id: {
            type: String,
            ref: 'accounts',
        },
        account_user_id: {
            type: String,
            required : true,
        },
        user_id: {
            type: String,
            ref: 'players',
        },
        game_id: {
            type: String,
            ref: 'games',
        },
        game_name: {
            type: String,
            required : true,
        },
        provider_id: {
            type: String,
            ref: 'providers',
        },
        provider_name: {
            type: String,
            required : true,
        },
        game_category_id: {
            type: String,
            ref: 'categories',
        },
        game_category_name: {
            type: String,
            required : true,
        },
        bet_id: {
            type: String,
            required : true,
        },
        round_id: {
            type: String,
            required : true,
        },
        operator_transaction_id: {
            type: String,
            required : true,
        },
        transaction_amount: {
            type: Number,
            required : true,
        },
        transaction_type: {
            type: String,
            required : true,
        },
        status: {
            type: String,
            // default : "online",
            required : true,
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
  
  module.exports = smObj;
  