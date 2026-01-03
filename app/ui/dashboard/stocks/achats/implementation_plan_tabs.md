# Separation of Individual and Association Purchases in Achats Table

This plan describes how to implement a tabbed interface in the `Achats` table to separate purchases made by individual cultivators from those made by associations/cooperatives, following the same pattern as the `Cultivators` table.

## Proposed Changes

### [Achats Management Component]

#### [MODIFY] [achats-list-table.jsx](file:///e:/BESD/ANAGESSA/dashboard_prototype_1/agrobu_0.0/odeca/app/ui/dashboard/stocks/achats/achats-list-table.jsx)

- Refactor the current `AchatsListTable` content into a reusable `DataTable` component.
- The main `AchatsListTable` component will now take `individualData` and `associationData` as props.
- Implement `Tabs` from `@/components/ui/tabs` to switch between "Individuels" and "Associations / Coopératives".
- Update the `DataTable`'s "Cafeiculteur" column to:
  - Display `cultivator_assoc_name` if it exists.
  - Display `last_name` and `first_name` otherwise.
  - Update the `filterFn` to include `cultivator_assoc_name` in the search results.

#### [MODIFY] [achats_data.jsx](file:///e:/BESD/ANAGESSA/dashboard_prototype_1/agrobu_0.0/odeca/app/ui/dashboard/stocks/achats/achats_data.jsx)

- Update the `formatData` function to include association fields:
  - `cultivator_assoc_name`
  - `cultivator_assoc_rep_name`
- Split the fetched `achatsData` into two separate states: `individualAchats` and `associationAchats`.
- Pass these filtered lists to the updated `AchatsListTable`.

## Verification Plan

### Manual Verification

1. Navigate to the "Achats" page in the "Stocks" module.
2. Verify that two tabs are visible: "Individuels" and "Associations / Coopératives".
3. Check that switching tabs displays the correct set of purchases.
4. Verify that association names are correctly displayed in the "Cafeiculteur" column when the "Associations" tab is active.
5. Test the search bar to ensure it finds both individual names and association names.
