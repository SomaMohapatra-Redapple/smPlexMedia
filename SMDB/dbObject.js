let smObj = {
    Account: {
        client_id: {
            type: String,
            ref: 'clients',
            isObjectId: true
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
    AccountTechnicals: {
        client_id: {
            type: String,
            ref: 'clients',
            isObjectId: true,
        },
        account_id: {
            type: String,
            ref: 'accounts',
            isObjectId: true,
        },
        api_username: {
            type: String,
            required: true,
        },
        api_secret: {
            type: String,
            required: true,
        },
        service_endpoint: {
            type: String,
            required: true,
        },
        currency: {
            type: String,
            required: true
        },
        is_maintenance_mode_on: {
            type: String,
            required: true,
            default: 'N',
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
    Category: {
        game_provider_id: {
            type: String,
            ref: 'providers',
            required: true,
            isObjectId: true,
        },
        category: {
            type: String,
            required: true,
        },
        category_icon: {
            type: String,
            required: true,
        },
        category_order: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            // default : "online",
            required: true,
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
    Client: {
        client_name: {
            type: String,
            required: true,
        },
        parent_client_id: {
            type: String,
            default: null,
            isObjectId: true,
        },
        contact: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            default: null,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "online",
            required: true,
        },
        environment: {
            type: String,
            default: "staging",
            required: true,
        },
        created_by: {
            type: String,
            default: null
        },
        updated_by: {
            type: String,
            default: null
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
    Game: {
        game_provider_id: {
            type: String,
            ref: 'providers',
            required: true,
            isObjectId: true
        },
        game_category_id: {
            type: String,
            ref: 'categories',
            required: true,
            isObjectId: true
        },
        game_name: [
            Object
        ],
        game_image: {
            type: String,
            required: true,
        },
        game_code: {
            type: String,
            required: true,
        },
        is_featured: {
            type: Boolean,
            required: true,
        },
        is_jackpot: {
            type: Boolean,
            required: true,
        },
        is_popular: {
            type: Boolean,
            required: true,
        },
        is_new: {
            type: Boolean,
            required: true,
        },
        game_tag_image: {
            type: String,
            default: null,
        },
        game_type: {
            type: String,
            required: true,
        },
        game_order: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            // default : "online",
            required: true,
        },
        release_date: {
            type: Date,
            required: true,
        },
        game_type_name: {
            type: String,
            required: true,
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
    Player: {
        account_id: {
            type: String,
            ref: 'accounts',
            isObjectId: true
        },
        account_user_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        username: {
            type: String,
            default: null,
        },
        currency_code: {
            type: String,
            required: true,
        },
        language_code: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            // default : "online",
            required: true,
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
    Provider: {
        game_provider_name: {
            type: String,
            required: true,
        },
        is_subprovider: {
            type: Boolean,
            required: true,
            default: false,
        },
        parent_game_provider_id: {
            type: String,
            ref: 'providers',
            required: false,
        },
        status: {
            type: String,
            // default : "online",
            required: true,
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
    Provider_account: {
        provider_account_name: {
            type: String,
            required: true
        },
        provider_id: {
            type: String,
            ref: 'providers',
            isObjectId: true
        },
        technical_detais: [
            Object
        ],
        account_status: {
            type: String,
            default: "Active",
            required: true
        },
        game_category: {
            type: String,
            required: true
        },
        currency: {
            type: Array,
            required: true
        },
        is_default: {
            type: Boolean,
            required: true,
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
    SuperAdmin: {
        admin_name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "online",
            required: true,
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
    Transaction: {
        session_id: {
            type: String,
            required: false,
            default: "",
        },
        account_id: {
            type: String,
            ref: 'accounts',
            isObjectId: true
        },
        account_user_id: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            ref: 'players',
            isObjectId: true
        },
        game_id: {
            type: String,
            ref: 'games',
            isObjectId: true
        },
        game_name: {
            type: String,
            required: true,
        },
        provider_id: {
            type: String,
            ref: 'providers',
            isObjectId: true
        },
        provider_name: {
            type: String,
            required: true,
        },
        provider_transaction_id: {
            type: String,
            required: true,
        },
        game_category_id: {
            type: String,
            ref: 'categories',
            isObjectId: true
        },
        game_category_name: {
            type: String,
            required: true,
        },
        round_id: {
            type: String,
            required: true,
        },
        operator_transaction_id: {
            type: String,
            required: true,
        },
        transaction_amount: {
            type: Number,
            required: true,
        },
        transaction_type: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            default: "",
            required: true,
        },
        status: {
            type: String,
            // default : "online",
            required: true,
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
    Client_provider_mapping: {
        client_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        account_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        provider_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        status: {
            type: Number,
            required: true,
            default: 0,
            enum: [0, 1, 2]
        }
    },
    Client_game_mapping: {
        client_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        account_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        game_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        status: {
            type: Number,
            required: true,
            default: 0,
            enum: [0, 1, 2]
        }
    },
    Client_provider_account_mapping: {
        client_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        account_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        provider_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        provider_account_id: {
            type: String,
            required: true,
            isObjectId: true
        },
        status: {
            type: Number,
            required: true,
            default: 0,
            enum: [0, 1, 2]
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
    Currency: {
        currency_code: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            required: true,
            default: 0,
            enum: [0, 1, 2]
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
