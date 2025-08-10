# CSS Designer

this directory contains the CSS designer component, which is a extensible component for editing CSS styles using a design wizard.

## Definitions

the designer requires a number of definitions to work.
the following names are used:

| Name        | File                              | Description                                                                                                                  |
| ----------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `selector`  | `./definitions/selectors.ts`      | defines the CSS selectors that can be edited in the designer. each selector has a list of **properties** that are be edited. |
| `property`  | `./definitions/properties.ts`     | defines the CSS properties that can be edited in the designer. each property has a **kind** that defines its behaviour.      |
| `kind`      | `./definitions/properties.ts`     | defines the data structure for that kind of value. provides the basis for both **generators** and **controls**.              |
| `generator` | `./definitions/generators.ts`     | defines how the CSS is generated for each property.                                                                          |
| `control`   | `./components/controls/index.tsx` | defines how the property is represented in the designer.                                                                     |

to add a new selector or property, you need to follow the steps below.

> [!NOTE]
> besides the definitions, you'll also need to add the appropriate translation messages to `messages/[language].json` files.

### add a new selector

1. open `./definitions/selectors.ts`
2. add the definition for the new selector to the `SELECTORS` record. Selectors must be unique. the key is the css selector matching the syntax in css files (so `.foo` selects all elements with the class `foo`).
3. in the `properties` array, define all properties that can be edited for this selector.

### add a new property

1. open `./definitions/properties.ts`
2. add the property definition to the `PROPERTIES` object. the key is the name of the property (as in css).
3. add the `kind` to define what kind of property it is and how it is represented in the designer. depending on the kind, additional fields may be required in the definition.

> [!NOTE]
> the property names have a special case: by using `$` as a delimiter, you can define a suffix for the selector the property applies to. for example, define `color$:hover` to apply the color property to the `:hover` state of the selector. this is useful for pseudo-classes and pseudo-elements.

### add a new kind

1. open `./definitions/kinds.ts`
2. add the new kind and its data scheam to the `PROP_SCHEMA_BY_KIND` object
3. create a new type or interface in `./defintions/properties.ts` that describes any additional fields required in the property definition. refer to the existing kinds for examples.
4. add the new options type of the new kind to the `CSSPropertyOptionsForKind` helper type.
5. also add the new options type to the `CSSPropertyKinds` type.
6. follow the steps below to add a new control and a new generator for the kind.

#### add a new control

1. open `./components/controls/index.tsx`
2. add a new entry for the kind in the `CONTROLS` object, mapping the kind to the component that will render it. refer to the existing controls for examples.

#### add a new CSS generator

1. open `./definitions/generators.ts`
2. add a new entry for the kind in the `GENERATORS` object, providing a function that generates the CSS value part for the property based on the data structure defined in the kind. refer to the existing generators for examples.

#### add a new test case for the generator

1. open `./generator.test.ts`
2. add a new test case for the newly created property kind that tests the CSS generation logic. use the existing tests as a reference for how to structure the test cases.
