import { AngularSelector, waitForAngular } from 'testcafe-angular-selectors';
import { Selector } from 'testcafe';
import { password, Selectors, username } from './tc-config';

fixture `Aircall e2e`
  .page('http://localhost:4200')
  .beforeEach(async t => {
    await waitForAngular();
  });

test('Should login and display calls', async t => {
  const loginForm = AngularSelector(Selectors.LoginForm);

  await t
    .typeText(loginForm.find(Selectors.UsernameInput), username)
    .typeText(loginForm.find(Selectors.PasswordInput), password)
    .click(loginForm.find(Selectors.LoginButton))
    .expect(Selector(Selectors.Call, { visibilityCheck: true }).innerText).notEql('undefined');
});

test('Should display new calls by using the paginator', async t => {
  const loginForm = AngularSelector(Selectors.LoginForm);

  await t
    .typeText(loginForm.find(Selectors.UsernameInput), username)
    .typeText(loginForm.find(Selectors.PasswordInput), password)
    .click(loginForm.find(Selectors.LoginButton));

  const initialCalls = await Selector(Selectors.Call, { visibilityCheck: true });

  await t
    .click(Selector(Selectors.NextPage));

  const newCalls = await Selector(Selectors.Call, { visibilityCheck: true });

  await t
    .expect(initialCalls).notEql(newCalls);
});

test('Should apply filters to the calls', async t => {
  const loginForm = AngularSelector(Selectors.LoginForm);

  await t
    .typeText(loginForm.find(Selectors.UsernameInput), username)
    .typeText(loginForm.find(Selectors.PasswordInput), password)
    .click(loginForm.find(Selectors.LoginButton));

  const initialCalls = await Selector(Selectors.Call, { visibilityCheck: true });

  await t
    .click(Selector('div.filter[uitestid=\'filter-missed\'] input'))
    .click(Selector('div.filter[uitestid=\'filter-archieved\'] input'));

  const newCalls = await Selector(Selectors.Call, { visibilityCheck: true });

  await t
    .expect(initialCalls).notEql(newCalls);
});

test('Should archive/unarchive the first call', async t => {
  const loginForm = AngularSelector(Selectors.LoginForm);

  await t
    .typeText(loginForm.find(Selectors.UsernameInput), username)
    .typeText(loginForm.find(Selectors.PasswordInput), password)
    .click(loginForm.find(Selectors.LoginButton));

  const firstCall = await AngularSelector('call')
    .nth(0);

  await t
    .click(Selector(Selectors.NextPage)); // calls at page 1 returns 404

  const className = await firstCall.find(Selectors.ArchiveButton).getAttribute('class');

  await t
    .click(firstCall.find(Selectors.ArchiveButton))
    .wait(1500); // wait for the rest call

  const newClassnames = await Selector(Selectors.ArchiveButton, { visibilityCheck: true })
    .nth(0)
    .getAttribute('class');

  await t
    .expect(newClassnames).notEql(className);
});
