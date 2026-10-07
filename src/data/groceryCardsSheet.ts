// Google Sheet Database: "Cards"
// Columns: Card_Name | Cashback_Percent | Annual_Fee | Where_Works | Network | Apply_Link
// Works 100% offline, zero APIs, pure math calculator

export interface GroceryCardRow {
  id: string;
  Card_Name: string;
  Cashback_Percent: number;
  Annual_Fee: number;
  Where_Works: string;
  Network: string;
  Apply_Link: string;
}

export const GROCERY_CARDS_SHEET: GroceryCardRow[] = [
  {
    id: 'card-1',
    Card_Name: 'Amex Blue Cash Preferred',
    Cashback_Percent: 6,
    Annual_Fee: 95,
    Where_Works: 'US Supermarkets',
    Network: 'Amex',
    Apply_Link: 'https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/',
  },
  {
    id: 'card-2',
    Card_Name: 'Amex Blue Cash Everyday',
    Cashback_Percent: 3,
    Annual_Fee: 0,
    Where_Works: 'US Supermarkets',
    Network: 'Amex',
    Apply_Link: 'https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/',
  },
  {
    id: 'card-3',
    Card_Name: 'Chase Freedom Flex',
    Cashback_Percent: 5,
    Annual_Fee: 0,
    Where_Works: 'Rotating (Grocery quarter)',
    Network: 'Chase',
    Apply_Link: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/flex',
  },
  {
    id: 'card-4',
    Card_Name: 'Capital One SavorOne',
    Cashback_Percent: 3,
    Annual_Fee: 0,
    Where_Works: 'Grocery Stores',
    Network: 'Mastercard',
    Apply_Link: 'https://www.capitalone.com/credit-cards/savorone-dining-rewards/',
  },
  {
    id: 'card-5',
    Card_Name: 'Citi Custom Cash',
    Cashback_Percent: 5,
    Annual_Fee: 0,
    Where_Works: 'Grocery (up to $500)',
    Network: 'Mastercard',
    Apply_Link: 'https://www.citi.com/credit-cards/citi-custom-cash-credit-card',
  },
  {
    id: 'card-6',
    Card_Name: 'Wells Fargo Active Cash',
    Cashback_Percent: 2,
    Annual_Fee: 0,
    Where_Works: 'Everywhere',
    Network: 'Visa',
    Apply_Link: 'https://creditcards.wellsfargo.com/active-cash-credit-card/',
  },
  {
    id: 'card-7',
    Card_Name: 'Chase Sapphire Preferred',
    Cashback_Percent: 3,
    Annual_Fee: 95,
    Where_Works: 'Online Grocery',
    Network: 'Chase',
    Apply_Link: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred',
  },
  {
    id: 'card-8',
    Card_Name: 'Bank of America Customized',
    Cashback_Percent: 3,
    Annual_Fee: 0,
    Where_Works: 'Grocery',
    Network: 'Visa',
    Apply_Link: 'https://www.bankofamerica.com/credit-cards/products/cash-back-credit-card/',
  },
  {
    id: 'card-9',
    Card_Name: 'Discover It',
    Cashback_Percent: 5,
    Annual_Fee: 0,
    Where_Works: 'Rotating Grocery',
    Network: 'Discover',
    Apply_Link: 'https://www.discover.com/credit-cards/cash-back/it-card.html',
  },
  {
    id: 'card-10',
    Card_Name: 'US Bank Cash+',
    Cashback_Percent: 5,
    Annual_Fee: 0,
    Where_Works: 'Choose Grocery',
    Network: 'Visa',
    Apply_Link: 'https://www.usbank.com/credit-cards/cash-plus-visa-signature-credit-card.html',
  },
  {
    id: 'card-11',
    Card_Name: 'Citi Double Cash',
    Cashback_Percent: 2,
    Annual_Fee: 0,
    Where_Works: 'Everywhere',
    Network: 'Mastercard',
    Apply_Link: 'https://www.citi.com/credit-cards/citi-double-cash-credit-card',
  },
  {
    id: 'card-12',
    Card_Name: 'Debit Card / Cash',
    Cashback_Percent: 0,
    Annual_Fee: 0,
    Where_Works: 'Everywhere',
    Network: 'N/A',
    Apply_Link: '#',
  },
];
