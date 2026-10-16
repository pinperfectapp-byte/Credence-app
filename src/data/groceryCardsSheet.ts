// Database: "Cards"
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
    Card_Name: 'Preferred Supermarket 6% Tier',
    Cashback_Percent: 6,
    Annual_Fee: 95,
    Where_Works: 'US Supermarkets',
    Network: 'Premier Network',
    Apply_Link: '#',
  },
  {
    id: 'card-2',
    Card_Name: 'Everyday Supermarket 3% Tier',
    Cashback_Percent: 3,
    Annual_Fee: 0,
    Where_Works: 'US Supermarkets',
    Network: 'Premier Network',
    Apply_Link: '#',
  },
  {
    id: 'card-3',
    Card_Name: 'Quarterly Rotating 5% Card',
    Cashback_Percent: 5,
    Annual_Fee: 0,
    Where_Works: 'Rotating (Grocery quarter)',
    Network: 'National Network',
    Apply_Link: '#',
  },
  {
    id: 'card-4',
    Card_Name: 'Dining & Grocery 3% Card',
    Cashback_Percent: 3,
    Annual_Fee: 0,
    Where_Works: 'Grocery Stores',
    Network: 'National Network',
    Apply_Link: '#',
  },
  {
    id: 'card-5',
    Card_Name: 'Top Category 5% Card',
    Cashback_Percent: 5,
    Annual_Fee: 0,
    Where_Works: 'Grocery (up to $500)',
    Network: 'National Network',
    Apply_Link: '#',
  },
  {
    id: 'card-6',
    Card_Name: 'Flat 2% Everywhere Card',
    Cashback_Percent: 2,
    Annual_Fee: 0,
    Where_Works: 'Everywhere',
    Network: 'National Network',
    Apply_Link: '#',
  },
  {
    id: 'card-7',
    Card_Name: 'Travel Rewards 3% Online Grocery',
    Cashback_Percent: 3,
    Annual_Fee: 95,
    Where_Works: 'Online Grocery',
    Network: 'Premier Network',
    Apply_Link: '#',
  },
  {
    id: 'card-8',
    Card_Name: 'Custom Choice 3% Grocery Card',
    Cashback_Percent: 3,
    Annual_Fee: 0,
    Where_Works: 'Grocery',
    Network: 'National Network',
    Apply_Link: '#',
  },
  {
    id: 'card-9',
    Card_Name: 'Member Rewards 5% Seasonal Card',
    Cashback_Percent: 5,
    Annual_Fee: 0,
    Where_Works: 'Rotating Grocery',
    Network: 'Direct Network',
    Apply_Link: '#',
  },
  {
    id: 'card-10',
    Card_Name: 'Selected Category 5% Cash Card',
    Cashback_Percent: 5,
    Annual_Fee: 0,
    Where_Works: 'Choose Grocery',
    Network: 'National Network',
    Apply_Link: '#',
  },
  {
    id: 'card-11',
    Card_Name: 'Unlimited 2% Double Cash Card',
    Cashback_Percent: 2,
    Annual_Fee: 0,
    Where_Works: 'Everywhere',
    Network: 'National Network',
    Apply_Link: '#',
  },
  {
    id: 'card-12',
    Card_Name: 'Standard Debit Card / Cash',
    Cashback_Percent: 0,
    Annual_Fee: 0,
    Where_Works: 'Everywhere',
    Network: 'N/A',
    Apply_Link: '#',
  },
];
