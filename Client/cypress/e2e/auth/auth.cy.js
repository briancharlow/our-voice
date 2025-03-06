// cypress/e2e/login.cy.js
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form correctly', () => {
    cy.contains('Join Us today, as we Build Kenya, For Kenyans');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Log in');
  });

  it('should navigate to signup page when SignUp is clicked', () => {
    cy.contains('SignUp').click();
    cy.url().should('include', '/signup');
  });

  it('should navigate to forgot password page when Forgot Password is clicked', () => {
    cy.contains('Forgot Password?').click();
    cy.url().should('include', '/forgot-password');
  });
});

// cypress/e2e/signup.cy.js
describe('Signup Page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('should display the signup form correctly', () => {
    cy.contains('Join Us today, as we Build Kenya, For Kenyans');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('select[name="location"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Sign Up');
  });

  it('should navigate to login page when Login is clicked', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/login');
  });

  it('should display counties in the location dropdown', () => {
    cy.get('select[name="location"]').click();
    cy.get('select[name="location"] option').should('contain', 'Nairobi');
    cy.get('select[name="location"] option').should('contain', 'Mombasa');
  });
});

// cypress/e2e/reset-password.cy.js
describe('Reset Password Page', () => {
  const resetToken = 'test-token';

  beforeEach(() => {
    cy.visit(`/reset-password/${resetToken}`);
  });

  it('should display the reset password form correctly', () => {
    cy.contains('Reset Your Password');
    cy.get('input[name="newPassword"]').should('exist');
    cy.get('input[name="confirmPassword"]').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Reset Password');
  });

  it('should show error when passwords do not match', () => {
    cy.get('input[name="newPassword"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('different-password');
    cy.get('button[type="submit"]').click();
    cy.contains('Passwords do not match');
  });
});

// cypress/e2e/basic-auth-flow.cy.js
describe('Basic Authentication Flow', () => {
  it('should navigate between authentication pages', () => {
    // Start at login page
    cy.visit('/login');
    
    // Go to signup page
    cy.contains('SignUp').click();
    cy.url().should('include', '/signup');
    
    // Go back to login page
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    
    // Go to forgot password page
    cy.contains('Forgot Password?').click();
    cy.url().should('include', '/forgot-password');
  });
});