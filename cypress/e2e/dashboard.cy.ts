import { category_launched, init_config, init_stat, local_items, login_token, product_offering } from "../support/constants"
import * as moment from 'moment';
export const checkHeaderPreLogin = () => {
    // Mocks
    cy.intercept( {method:'GET', url: 'http://proxy.docker:8004/stats'}, init_stat).as('stats')
    cy.intercept( {method: 'GET', url: 'http://proxy.docker:8004/catalog/productOffering?*'}, product_offering).as('productOffering')
    cy.intercept( {method: 'GET', url: 'http://proxy.docker:8004/config'}, init_config).as('config')
    cy.intercept( {method:'GET', url: 'http://proxy.docker:8004/catalog/category?*'}, category_launched).as('category')
    // Verify mocks are called 1 time
    cy.visit('/')
    cy.wait('@stats')
    cy.get('@stats.all').should('have.length', 1)
    cy.wait('@config')
    cy.get('@config.all').should('have.length', 1)
    cy.wait('@productOffering')
    cy.get('@productOffering.all').should('have.length', 1)
    cy.wait('@category')
    cy.get('@category.all').should('have.length', 1)
    // Verify header interactive elemements are displayed and work as expected
    cy.login().should('exist')
    cy.getBySel('publishOffering').should('exist')
    cy.getBySel('browse').should('exist')
    cy.getBySel('about').should('exist')
    cy.getBySel('registerAcc').should('exist')
    cy.getBySel('knowledge').should('exist')
    cy.getBySel('darkMode').should('exist')

    cy.getBySel('darkMode').click()
    cy.getBySel('moonSVG').should('have.class', 'hidden')
    cy.getBySel('sunSVG').should('not.have.class', 'hidden')
    cy.getBySel('darkMode').click()
    cy.getBySel('sunSVG').should('have.class', 'hidden')
    cy.getBySel('moonSVG').should('not.have.class', 'hidden')

    cy.getBySel('knowledge').should('have.attr', 'href', init_config.knowledgeBaseUrl)
};

export const checkHeaderPostLogin = () => {
    // Verify header interactive elemements are displayed and work as expected
    cy.login().should('not.exist')
    cy.getBySel('registerAcc').should('not.exist')
    cy.getBySel('loggedAcc').should('exist')
    cy.getBySel('publishOffering').should('exist')
    cy.getBySel('browse').should('exist')
    cy.getBySel('about').should('exist')
    cy.getBySel('knowledge').should('exist')
    cy.getBySel('darkMode').should('exist')

    cy.getBySel('darkMode').click()
    cy.getBySel('moonSVG').should('have.class', 'hidden')
    cy.getBySel('sunSVG').should('not.have.class', 'hidden')
    cy.getBySel('darkMode').click()
    cy.getBySel('sunSVG').should('have.class', 'hidden')
    cy.getBySel('moonSVG').should('not.have.class', 'hidden')

    cy.getBySel('knowledge').should('have.attr', 'href', init_config.knowledgeBaseUrl)
};

describe('/dashboard',{
    viewportHeight: 800,
    viewportWidth: 1080,
  },
  () => {

    it('should login successfully and show the required components in pre-login and post-login', () => {
        checkHeaderPreLogin()
        local_items.expire = moment().unix() + 100
        cy.window().then((window) => window.localStorage.setItem('login_items', JSON.stringify(local_items)))

        // Mocks
        cy.intercept(
            {
              method: 'GET',
              url: 'http://proxy.docker:8004/logintoken'
            },
            (req) => {
              req.reply({
                statusCode: 200,  // Código HTTP de respuesta
                body: login_token() // Llamada a la función que genera el token
              });
            }
          ).as('login_token');     

        cy.visit('/dashboard?token=test')

        cy.wait('@stats')
        cy.get('@stats.all').should('have.length', 2)
        cy.wait('@config')
        cy.get('@config.all').should('have.length', 2)
        cy.wait('@productOffering')
        cy.get('@productOffering.all').should('have.length', 2)
        cy.wait('@category')
        cy.get('@category.all').should('have.length', 2)
        cy.wait('@login_token')
        cy.get('@login_token.all').should('have.length', 1)

        checkHeaderPostLogin()

    })

    it('should have all required elements in dashboard', ()=>{
        checkHeaderPreLogin()
        cy.getBySel('browseServices').should('not.be.disabled')
        cy.getBySel('mainText').should('exist')
        cy.getBySel('publishOff').should('exist')
        cy.getBySel('publishOff').should('have.attr', 'href', init_config.domeRegister)
        cy.getBySel('vServices').should('exist')
        cy.getBySel('vServices').should('have.text', '1 verified services')
        cy.getBySel('rPublishers').should('exist')
        cy.getBySel('rPublishers').should('have.text', '1 registered publishers')
        cy.getBySel('nameServices').invoke('text').should('include', init_stat.services[0])
        cy.getBySel('nameOrgs').invoke('text').should('include', init_stat.organizations[0])

    })

})

