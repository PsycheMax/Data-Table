import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { DataTable } from '../src/DataTable.js';
import '../src/data-table.js';

describe('DataTable', () => {
  it('has a default header "Hey there" and counter 5', async () => {
    const el = await fixture<DataTable>(html`<data-table></data-table>`);

    expect(el.header).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<DataTable>(html`<data-table></data-table>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the header via attribute', async () => {
    const el = await fixture<DataTable>(html`<data-table header="attribute header"></data-table>`);

    expect(el.header).to.equal('attribute header');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<DataTable>(html`<data-table></data-table>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
