// cypress/integration/adminDashboard.spec.js

describe('Admin Dashboard Tests', () => {
    beforeEach(() => {
        cy.adminLogin(); // Use existing login helper
    });

    describe('Dashboard Home Tests', () => {
        it('should display the dashboard with users', () => {
            cy.visit('/admin-dashboard');
            cy.contains('h1', 'Manage Users').should('be.visible');
        });
    });

    describe('Polls Page Tests', () => {
        beforeEach(() => {
            cy.visit('/admin-dashboard/polls');
        });

        it('should display polls page header', () => {
            cy.contains('h1', 'Active Polls').should('be.visible');
        });
    });

    describe('Issues Page Tests', () => {
        beforeEach(() => {
            cy.visit('/admin-dashboard/issues');
        });

        it('should display the issues page with stats', () => {
            cy.contains('h1', 'Issues Dashboard').should('be.visible');
        });
    });

    describe('Documents Page Tests', () => {
        beforeEach(() => {
            cy.visit('/admin-dashboard/documents');
        });

        it('should display document management section', () => {
            cy.contains('h1', 'Document Management').should('be.visible');
        });

        it('should list existing documents', () => {
            cy.get('table tbody tr').should('have.length.at.least', 1);
        });
    });

    describe('Users Page Tests', () => {
        beforeEach(() => {
            cy.visit('/admin-dashboard');
        });

        it('should display user management section', () => {
            cy.contains('h1', 'Manage Users').should('be.visible');
        });
    });
});
