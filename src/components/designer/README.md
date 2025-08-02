# CSS Designer

this directory contains the CSS designer component, which is a extensible component for editing CSS styles using a design wizard.

## how to add a new selector

selectors are how the designer knows what "components" to show in the designer.
each selector is a arbitrary CSS selector that matches elements in the document.
for each selector, a list of properties is defined that can be edited for that selector.

1. open `src/components/designer/selectors.ts`
2. add the definition for the new selector to the `SELECTORS` object. Selectors must be unique. the key is the css selector matching the syntax in css files (so `.foo` selects all elements with the class `foo`).
3. in the `properties` array, define all properties that can be edited for this selector. See the next section for adding new properties.

## how to add a new property

properties are all the settings that can be edited for a selector.

1. open `src/components/designer/properties.ts`
2. add the property definition to the `PROPERTIES` object. the key is the name of the property (as in css). the `kind` defines what kind of property it is and how it is represented in the designer. depending on the kind, additional fields may be required in the definition. `generateCSS` is the function that generates the css for the property. it only needs to generate the value portion of the css rule, the selector and property name are generated automatically.
3. if you want to add a new kind, see below.

### how to add a new kind

property kinds define how the property is represented in the designer.

1. open `src/components/designer/properties.ts`
2. add the new kind to the `PROP_SCHEMA_BY_KIND` object. for each kind, a zod schema must be defined that describes the data structure of the property.
3. create a new type or interface in `properties.ts` that describes any additional fields required in the property definition. refer to the existing kinds for examples.
4. add the new options type of the new kind to the `CSSPropertyOptionsForKind` helper type.
5. also add the new options type to the `CSSPropertyKinds` type.
6. open `src/components/designer/controls/index.tsx`
7. add a new entry for the kind in the `CONTROLS` object. this object maps the kind to the component that renders the property in the designer.
8. implement a new component that renders the property in the designer. refer to the existing components for examples.
