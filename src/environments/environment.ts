export const environment = {
    BASE_URL: 'http://localhost:8004',
    LEGACY_PREFIX: '',
    //API_PORT: 8632,
    //API_PORT: 8004,
    //API ENDPOINTS
    PRODUCT_CATALOG: '/catalog',
    SERVICE: '/service',
    RESOURCE: '/resource',
    PRODUCT_SPEC: '/productSpecification',
    SERVICE_SPEC: '/serviceSpecification',
    RESOURCE_SPEC: '/resourceSpecification',
    ACCOUNT: '/account',
    SHOPPING_CART: '/shoppingCart',
    INVENTORY: '/inventory',
    PRODUCT_ORDER: '/ordering',
    //API PAGINATION
    PRODUCT_LIMIT: 6,
    CATALOG_LIMIT: 8,
    INVENTORY_LIMIT: 6,
    INVENTORY_RES_LIMIT: 6,
    INVENTORY_SERV_LIMIT: 6,
    PROD_SPEC_LIMIT: 6,
    SERV_SPEC_LIMIT: 6,
    RES_SPEC_LIMIT: 6,
    ORDER_LIMIT: 6,
    CATEGORY_LIMIT: 100,
    SIOP: false,
    TAX_RATE: 20,
    CHAT_API: 'https://85.215.243.214:5000/predict',
    SIOP_INFO: {
        enabled: false,
        isRedirection: false,
        pollPath: "",
        pollCertPath: "",
        clientID: "",
        callbackURL: "",
        verifierHost: "",
        verifierQRCodePath: "",
        requestUri: ""
    },
    MATOMO_TRACKER_URL: "",
    MATOMO_SITE_ID: "",
    TICKETING_SYSTEM_URL: "",
    KNOWLEDGE_BASE_URL: "",
    SEARCH_ENABLED: true,
    PURCHASE_ENABLED: false,
    DOME_TRUST_LINK: "https://dome-certification.dome-marketplace.org",
    DOME_ABOUT_LINK: '',
    DOME_REGISTER_LINK: '',
    DOME_PUBLISH_LINK:'',
    DOME_LINKEDIN: 'https://www.linkedin.com/company/dome-marketplace/',
    DOME_YOUTUBE: 'https://www.youtube.com/channel/UC8UiL59S0JiaYYr14w5eOzA',
    DOME_X: 'https://x.com/DomeMarketplace'
};
