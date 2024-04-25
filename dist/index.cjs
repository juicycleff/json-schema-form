
/*!
 Copyright (c) 2024 Remote Technology, Inc.
 NPM Package: @remoteoss/json-schema-form@0.9.1-beta.0
 Generated: Thu, 25 Apr 2024 23:07:32 GMT

 MIT License

Copyright (c) 2023 Remote Technology, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/ 
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  buildCompleteYupSchema: () => buildCompleteYupSchema,
  createHeadlessForm: () => createHeadlessForm,
  pickXKey: () => pickXKey
});
module.exports = __toCommonJS(src_exports);

// src/createHeadlessForm.js
var import_get3 = __toESM(require("lodash/get"));
var import_isNil3 = __toESM(require("lodash/isNil"));
var import_omit3 = __toESM(require("lodash/omit"));
var import_omitBy2 = __toESM(require("lodash/omitBy"));
var import_pick2 = __toESM(require("lodash/pick"));
var import_size = __toESM(require("lodash/size"));

// src/calculateConditionalProperties.js
var import_merge2 = __toESM(require("lodash/merge"));
var import_omit2 = __toESM(require("lodash/omit"));

// src/helpers.js
var import_get2 = __toESM(require("lodash/get"));
var import_isNil = __toESM(require("lodash/isNil"));
var import_omit = __toESM(require("lodash/omit"));
var import_omitBy = __toESM(require("lodash/omitBy"));
var import_set = __toESM(require("lodash/set"));
var import_yup2 = require("yup");

// src/utils.js
function convertDiskSizeFromTo(from, to) {
  const units = ["bytes", "kb", "mb"];
  return function convert(value) {
    return value * Math.pow(1024, units.indexOf(from.toLowerCase())) / Math.pow(1024, units.indexOf(to.toLowerCase()));
  };
}
function hasProperty(object2, propertyName) {
  return Object.prototype.hasOwnProperty.call(object2, propertyName);
}

// src/checkIfConditionMatches.js
function checkIfConditionMatchesProperties(node, formValues, formFields, logic) {
  return Object.keys(node.if.properties ?? {}).every((name) => {
    const currentProperty = node.if.properties[name];
    const value = formValues[name];
    const hasEmptyValue = typeof value === "undefined" || // NOTE: This is a "Remote API" dependency, as empty fields are sent as "null".
    value === null;
    const hasIfExplicit = node.if.required?.includes(name);
    if (hasEmptyValue && !hasIfExplicit) {
      return true;
    }
    if (hasProperty(currentProperty, "const")) {
      return compareFormValueWithSchemaValue(value, currentProperty.const);
    }
    if (currentProperty.contains?.pattern) {
      const formValue = value || [];
      if (Array.isArray(formValue)) {
        const pattern = new RegExp(currentProperty.contains.pattern);
        return (value || []).some((item) => pattern.test(item));
      }
    }
    if (currentProperty.enum) {
      return currentProperty.enum.includes(value);
    }
    if (currentProperty.properties) {
      return checkIfConditionMatchesProperties(
        { if: currentProperty },
        formValues[name],
        getField(name, formFields).fields,
        logic
      );
    }
    const field = getField(name, formFields);
    return validateFieldSchema(
      {
        ...field,
        ...currentProperty,
        required: true
      },
      value
    );
  });
}
function checkIfMatchesValidationsAndComputedValues(node, formValues, logic, parentID) {
  const validationsMatch = Object.entries(node.if.validations ?? {}).every(([name, property]) => {
    const currentValue = logic.getScope(parentID).applyValidationRuleInCondition(name, formValues);
    if (Object.hasOwn(property, "const") && currentValue === property.const)
      return true;
    return false;
  });
  const computedValuesMatch = Object.entries(node.if.computedValues ?? {}).every(
    ([name, property]) => {
      const currentValue = logic.getScope(parentID).applyComputedValueRuleInCondition(name, formValues);
      if (Object.hasOwn(property, "const") && currentValue === property.const)
        return true;
      return false;
    }
  );
  return computedValuesMatch && validationsMatch;
}

// src/internals/helpers.js
var import_merge = __toESM(require("lodash/fp/merge"));
var import_get = __toESM(require("lodash/get"));
var import_isEmpty = __toESM(require("lodash/isEmpty"));
var import_isFunction = __toESM(require("lodash/isFunction"));
function pickXKey(node, key) {
  const deprecatedKeys = ["presentation", "errorMessage"];
  return (0, import_get.default)(node, `x-jsf-${key}`, deprecatedKeys.includes(key) ? node?.[key] : void 0);
}
function getFieldDescription(node, customProperties = {}) {
  const nodeDescription = node?.description ? {
    description: node.description
  } : {};
  const customDescription = customProperties?.description ? {
    description: (0, import_isFunction.default)(customProperties.description) ? customProperties.description(node?.description, {
      ...node,
      ...customProperties
    }) : customProperties.description
  } : {};
  const nodePresentation = pickXKey(node, "presentation");
  const presentation = !(0, import_isEmpty.default)(nodePresentation) && {
    presentation: { ...nodePresentation, ...customDescription }
  };
  return (0, import_merge.default)(nodeDescription, { ...customDescription, ...presentation });
}

// src/internals/fields.js
var jsonTypes = {
  STRING: "string",
  NUMBER: "number",
  INTEGER: "integer",
  OBJECT: "object",
  ARRAY: "array",
  BOOLEAN: "boolean",
  NULL: "null"
};
var supportedTypes = {
  TEXT: "text",
  NUMBER: "number",
  SELECT: "select",
  FILE: "file",
  RADIO: "radio",
  GROUP_ARRAY: "group-array",
  EMAIL: "email",
  DATE: "date",
  CHECKBOX: "checkbox",
  FIELDSET: "fieldset"
};
var jsonTypeToInputType = {
  [jsonTypes.STRING]: ({ oneOf, format }) => {
    if (format === "email")
      return supportedTypes.EMAIL;
    if (format === "date")
      return supportedTypes.DATE;
    if (format === "data-url")
      return supportedTypes.FILE;
    if (oneOf)
      return supportedTypes.RADIO;
    return supportedTypes.TEXT;
  },
  [jsonTypes.NUMBER]: () => supportedTypes.NUMBER,
  [jsonTypes.INTEGER]: () => supportedTypes.NUMBER,
  [jsonTypes.OBJECT]: () => supportedTypes.FIELDSET,
  [jsonTypes.ARRAY]: ({ items }) => {
    if (items.properties)
      return supportedTypes.GROUP_ARRAY;
    return supportedTypes.SELECT;
  },
  [jsonTypes.BOOLEAN]: () => supportedTypes.CHECKBOX
};
function getInputType(fieldProperties, strictInputType, name) {
  const presentation = pickXKey(fieldProperties, "presentation") ?? {};
  const presentationInputType = presentation?.inputType;
  if (presentationInputType) {
    return presentationInputType;
  }
  if (strictInputType) {
    throw Error(`Strict error: Missing inputType to field "${name || fieldProperties.title}".
You can fix the json schema or skip this error by calling createHeadlessForm(schema, { strictInputType: false })`);
  }
  if (!fieldProperties.type) {
    if (fieldProperties.items?.properties) {
      return supportedTypes.GROUP_ARRAY;
    }
    if (fieldProperties.properties) {
      return supportedTypes.SELECT;
    }
    return jsonTypeToInputType[jsonTypes.STRING](fieldProperties);
  }
  return jsonTypeToInputType[fieldProperties.type]?.(fieldProperties);
}
function _composeFieldFile({ name, label, description, accept, required = true, ...attrs }) {
  return {
    type: supportedTypes.FILE,
    name,
    label,
    description,
    required,
    accept,
    ...attrs
  };
}
function _composeFieldText({ name, label, description, required = true, ...attrs }) {
  return {
    type: supportedTypes.TEXT,
    name,
    label,
    description,
    required,
    ...attrs
  };
}
function _composeFieldEmail({ name, label, required = true, ...attrs }) {
  return {
    type: supportedTypes.EMAIL,
    name,
    label,
    required,
    ...attrs
  };
}
function _composeFieldNumber({
  name,
  label,
  percentage = false,
  required = true,
  minimum,
  maximum,
  ...attrs
}) {
  let minValue = minimum;
  let maxValue = maximum;
  if (percentage) {
    minValue = minValue ?? 0;
    maxValue = maxValue ?? 100;
  }
  return {
    type: supportedTypes.NUMBER,
    name,
    label,
    percentage,
    required,
    minimum: minValue,
    maximum: maxValue,
    ...attrs
  };
}
function _composeFieldDate({ name, label, required = true, ...attrs }) {
  return {
    type: supportedTypes.DATE,
    name,
    label,
    required,
    ...attrs
  };
}
function _composeFieldRadio({ name, label, options, required = true, ...attrs }) {
  return {
    type: supportedTypes.RADIO,
    name,
    label,
    options,
    required,
    ...attrs
  };
}
function _composeFieldSelect({ name, label, options, required = true, ...attrs }) {
  return {
    type: supportedTypes.SELECT,
    name,
    label,
    options,
    required,
    ...attrs
  };
}
function _composeNthFieldGroup({ name, label, required, nthFieldGroup, ...attrs }) {
  return [
    {
      ...nthFieldGroup,
      type: supportedTypes.GROUP_ARRAY,
      name,
      label,
      required,
      ...attrs
    }
  ];
}
function _composeFieldCheckbox({
  required = true,
  name,
  label,
  description,
  default: defaultValue,
  checkboxValue,
  ...attrs
}) {
  return {
    type: supportedTypes.CHECKBOX,
    required,
    name,
    label,
    description,
    checkboxValue,
    ...defaultValue && { default: defaultValue },
    ...attrs
  };
}
function _composeFieldset({ name, label, fields, variant, ...attrs }) {
  return {
    type: supportedTypes.FIELDSET,
    name,
    label,
    fields,
    variant,
    ...attrs
  };
}
var _composeFieldArbitraryClosure = (inputType) => (attrs) => ({
  type: inputType,
  ...attrs
});
var inputTypeMap = {
  text: _composeFieldText,
  select: _composeFieldSelect,
  radio: _composeFieldRadio,
  date: _composeFieldDate,
  number: _composeFieldNumber,
  "group-array": _composeNthFieldGroup,
  fieldset: _composeFieldset,
  file: _composeFieldFile,
  email: _composeFieldEmail,
  checkbox: _composeFieldCheckbox
};
function _composeFieldCustomClosure(defaultComposeFn) {
  return ({ fieldCustomization, ...attrs }) => {
    const { description, ...restFieldCustomization } = fieldCustomization;
    const fieldDescription = getFieldDescription(attrs, fieldCustomization);
    const { nthFieldGroup, ...restAttrs } = attrs;
    const commonAttrs = {
      ...restAttrs,
      ...restFieldCustomization,
      ...fieldDescription
    };
    if (attrs.inputType === supportedTypes.GROUP_ARRAY) {
      return [
        {
          ...nthFieldGroup,
          ...commonAttrs
        }
      ];
    }
    return {
      ...defaultComposeFn(attrs),
      ...commonAttrs
    };
  };
}

// src/jsonLogic.js
var import_json_logic_js = __toESM(require("json-logic-js"));

// src/yupSchema.js
var import_flow = __toESM(require("lodash/flow"));
var import_noop = __toESM(require("lodash/noop"));
var import_randexp = require("randexp");
var import_yup = require("yup");
var DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
var baseString = (0, import_yup.string)().trim();
var todayDateHint = (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
var convertBytesToKB = convertDiskSizeFromTo("Bytes", "KB");
var convertKbBytesToMB = convertDiskSizeFromTo("KB", "MB");
var validateOnlyStrings = (0, import_yup.string)().trim().nullable().test(
  "is-string",
  "${path} must be a `string` type, but the final value was: `${value}`.",
  (value, context) => {
    if (context.originalValue !== null && context.originalValue !== void 0) {
      return typeof context.originalValue === "string";
    }
    return true;
  }
);
var compareDates = (d1, d2) => {
  let date1 = new Date(d1).getTime();
  let date2 = new Date(d2).getTime();
  if (date1 < date2) {
    return "LESSER";
  } else if (date1 > date2) {
    return "GREATER";
  } else {
    return "EQUAL";
  }
};
var validateMinDate = (value, minDate) => {
  const compare = compareDates(value, minDate);
  return compare === "GREATER" || compare === "EQUAL" ? true : false;
};
var validateMaxDate = (value, minDate) => {
  const compare = compareDates(value, minDate);
  return compare === "LESSER" || compare === "EQUAL" ? true : false;
};
var validateRadioOrSelectOptions = (value, options) => {
  if (value === void 0)
    return true;
  const exactMatch = options.some((option) => option.value === value);
  if (exactMatch)
    return true;
  const patternMatch = options.some((option) => option.pattern?.test(value));
  return !!patternMatch;
};
var yupSchemas = {
  text: validateOnlyStrings,
  radioOrSelectString: (options) => {
    return (0, import_yup.string)().nullable().transform((value) => {
      if (value === "") {
        return void 0;
      }
      if (options?.some((option) => option.value === null)) {
        return value;
      }
      return value === null ? void 0 : value;
    }).test(
      "matchesOptionOrPattern",
      ({ value }) => `The option ${JSON.stringify(value)} is not valid.`,
      (value) => validateRadioOrSelectOptions(value, options)
    );
  },
  date: ({ minDate, maxDate }) => {
    let dateString = (0, import_yup.string)().nullable().transform((value) => {
      if (value === "") {
        return void 0;
      }
      return value === null ? void 0 : value;
    }).trim().matches(
      /(?:\d){4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9]|3[0-1])/,
      `Must be a valid date in ${DEFAULT_DATE_FORMAT.toLocaleLowerCase()} format. e.g. ${todayDateHint}`
    );
    if (minDate) {
      dateString = dateString.test(
        "minDate",
        `The date must be ${minDate} or after.`,
        (value) => validateMinDate(value, minDate)
      );
    }
    if (maxDate) {
      dateString = dateString.test(
        "maxDate",
        `The date must be ${maxDate} or before.`,
        (value) => validateMaxDate(value, maxDate)
      );
    }
    return dateString;
  },
  radioOrSelectNumber: (options) => (0, import_yup.mixed)().typeError("The value must be a number").transform((value) => {
    if (options?.some((option) => option.value === null)) {
      return value;
    }
    return value === null ? void 0 : value;
  }).test(
    "matchesOptionOrPattern",
    ({ value }) => {
      return `The option ${JSON.stringify(value)} is not valid.`;
    },
    (value) => {
      if (value !== void 0 && typeof value !== "number")
        return false;
      return validateRadioOrSelectOptions(value, options);
    }
  ).nullable(),
  number: (0, import_yup.number)().typeError("The value must be a number").nullable(),
  file: (0, import_yup.array)().nullable(),
  email: (0, import_yup.string)().trim().email("Please enter a valid email address").nullable(),
  fieldset: (0, import_yup.object)().nullable(),
  checkbox: (0, import_yup.string)().trim().nullable(),
  checkboxBool: (0, import_yup.boolean)(),
  multiple: {
    select: (0, import_yup.array)().nullable(),
    "group-array": (0, import_yup.array)().nullable()
  }
};
var yupSchemasToJsonTypes = {
  string: yupSchemas.text,
  number: yupSchemas.number,
  integer: yupSchemas.number,
  object: yupSchemas.fieldset,
  array: yupSchemas.multiple.select,
  boolean: yupSchemas.checkboxBool,
  null: import_noop.default
};
function getRequiredErrorMessage(inputType, { inlineError, configError }) {
  if (inlineError)
    return inlineError;
  if (configError)
    return configError;
  if (inputType === supportedTypes.CHECKBOX)
    return "Please acknowledge this field";
  return "Required field";
}
var getJsonTypeInArray = (jsonType) => {
  return Array.isArray(jsonType) ? jsonType.find((val) => val !== "null") : jsonType;
};
var getOptions = (field) => {
  const allValues = field.options?.map((option) => ({
    value: option.value,
    pattern: option.pattern ? new RegExp(option.pattern) : null
  }));
  const isOptionalWithNull = Array.isArray(field.jsonType) && // @TODO should also check the "oneOf" directly looking for "null"
  // option but we don't have direct access at this point.
  // Otherwise the JSON Schema validator will fail as explained in PR#18
  field.jsonType.includes("null");
  return isOptionalWithNull ? [...allValues, { option: null }] : allValues;
};
var getYupSchema = ({ inputType, ...field }) => {
  const jsonType = getJsonTypeInArray(field.jsonType);
  const hasOptions = field.options?.length > 0;
  const generateOptionSchema = (type) => {
    const optionValues = getOptions(field);
    return type === "number" ? yupSchemas.radioOrSelectNumber(optionValues) : yupSchemas.radioOrSelectString(optionValues);
  };
  if (hasOptions) {
    if (Array.isArray(field.jsonType)) {
      return field.jsonType.includes("number") ? generateOptionSchema("number") : generateOptionSchema("string");
    }
    return generateOptionSchema(field.jsonType);
  }
  if (field.format === "date") {
    return yupSchemas.date({ minDate: field.minDate, maxDate: field.maxDate });
  }
  return yupSchemas[inputType] || yupSchemasToJsonTypes[jsonType];
};
function buildYupSchema(field, config, logic) {
  const { inputType, jsonType: jsonTypeValue, errorMessage = {}, ...propertyFields } = field;
  const isCheckboxBoolean = typeof propertyFields.checkboxValue === "boolean";
  let baseSchema;
  const errorMessageFromConfig = config?.inputTypes?.[inputType]?.errorMessage || {};
  if (propertyFields.multiple) {
    baseSchema = yupSchemas.multiple[inputType] || yupSchemasToJsonTypes.array;
  } else if (isCheckboxBoolean) {
    baseSchema = yupSchemas.checkboxBool;
  } else {
    baseSchema = getYupSchema(field);
  }
  if (!baseSchema) {
    return import_noop.default;
  }
  const randomPlaceholder = propertyFields.pattern && (0, import_randexp.randexp)(propertyFields.pattern);
  const requiredMessage = getRequiredErrorMessage(inputType, {
    inlineError: errorMessage.required,
    configError: errorMessageFromConfig.required
  });
  function withRequired(yupSchema) {
    if (isCheckboxBoolean) {
      return yupSchema.oneOf([true], requiredMessage).required(requiredMessage);
    }
    return yupSchema.required(requiredMessage);
  }
  function withMin(yupSchema) {
    return yupSchema.min(
      propertyFields.minimum,
      (message) => errorMessage.minimum ?? errorMessageFromConfig.minimum ?? `Must be greater or equal to ${message.min}`
    );
  }
  function withMinLength(yupSchema) {
    return yupSchema.min(
      propertyFields.minLength,
      (message) => errorMessage.minLength ?? errorMessageFromConfig.minLength ?? `Please insert at least ${message.min} characters`
    );
  }
  function withMax(yupSchema) {
    return yupSchema.max(
      propertyFields.maximum,
      (message) => errorMessage.maximum ?? errorMessageFromConfig.maximum ?? `Must be smaller or equal to ${message.max}`
    );
  }
  function withMaxLength(yupSchema) {
    return yupSchema.max(
      propertyFields.maxLength,
      (message) => errorMessage.maxLength ?? errorMessageFromConfig.maxLength ?? `Please insert up to ${message.max} characters`
    );
  }
  function withMatches(yupSchema) {
    return yupSchema.matches(
      propertyFields.pattern,
      () => errorMessage.pattern ?? errorMessageFromConfig.pattern ?? `Must have a valid format. E.g. ${randomPlaceholder}`
    );
  }
  function withMaxFileSize(yupSchema) {
    return yupSchema.test(
      "isValidFileSize",
      errorMessage.maxFileSize ?? errorMessageFromConfig.maxFileSize ?? `File size too large. The limit is ${convertKbBytesToMB(propertyFields.maxFileSize)} MB.`,
      (files) => !files?.some((file) => convertBytesToKB(file.size) > propertyFields.maxFileSize)
    );
  }
  function withFileFormat(yupSchema) {
    return yupSchema.test(
      "isSupportedFormat",
      errorMessage.accept ?? errorMessageFromConfig.accept ?? `Unsupported file format. The acceptable formats are ${propertyFields.accept}.`,
      (files) => files && files?.length > 0 ? files.some((file) => {
        const fileType = file.name.split(".").pop();
        return propertyFields.accept.includes(fileType.toLowerCase());
      }) : true
    );
  }
  function withConst(yupSchema) {
    return yupSchema.test(
      "isConst",
      errorMessage.const ?? errorMessageFromConfig.const ?? `The only accepted value is ${propertyFields.const}.`,
      (value) => propertyFields.required === false && value === void 0 || value === null || value === propertyFields.const
    );
  }
  function withBaseSchema() {
    const customErrorMsg = errorMessage.type || errorMessageFromConfig.type;
    if (customErrorMsg) {
      return baseSchema.typeError(customErrorMsg);
    }
    return baseSchema;
  }
  function buildFieldSetSchema(innerFields) {
    const fieldSetShape = {};
    innerFields.forEach((fieldSetfield) => {
      if (fieldSetfield.fields) {
        fieldSetShape[fieldSetfield.name] = (0, import_yup.object)().shape(
          buildFieldSetSchema(fieldSetfield.fields)
        );
      } else {
        fieldSetShape[fieldSetfield.name] = buildYupSchema(
          {
            ...fieldSetfield,
            inputType: fieldSetfield.type
          },
          config
        )();
      }
    });
    return fieldSetShape;
  }
  function buildGroupArraySchema() {
    return (0, import_yup.object)().shape(
      propertyFields.nthFieldGroup.fields().reduce(
        (schema, groupArrayField) => ({
          ...schema,
          [groupArrayField.name]: buildYupSchema(groupArrayField, config)()
        }),
        {}
      )
    );
  }
  const validators = [withBaseSchema];
  if (inputType === supportedTypes.GROUP_ARRAY) {
    validators[0] = () => withBaseSchema().of(buildGroupArraySchema());
  } else if (inputType === supportedTypes.FIELDSET) {
    validators[0] = () => withBaseSchema().shape(buildFieldSetSchema(propertyFields.fields));
  }
  if (propertyFields.required) {
    validators.push(withRequired);
  }
  if (typeof propertyFields.minimum !== "undefined") {
    validators.push(withMin);
  }
  if (typeof propertyFields.minLength !== "undefined") {
    validators.push(withMinLength);
  }
  if (propertyFields.maximum !== void 0) {
    validators.push(withMax);
  }
  if (propertyFields.maxLength) {
    validators.push(withMaxLength);
  }
  if (propertyFields.pattern) {
    validators.push(withMatches);
  }
  if (propertyFields.maxFileSize) {
    validators.push(withMaxFileSize);
  }
  if (propertyFields.accept) {
    validators.push(withFileFormat);
  }
  if (typeof propertyFields.const !== "undefined") {
    validators.push(withConst);
  }
  if (propertyFields.jsonLogicValidations) {
    propertyFields.jsonLogicValidations.forEach(
      (id) => validators.push(yupSchemaWithCustomJSONLogic({ field, id, logic, config }))
    );
  }
  return (0, import_flow.default)(validators);
}
function getNoSortEdges(fields = []) {
  return fields.reduce((list, field) => {
    if (field.noSortEdges) {
      list.push(field.name);
    }
    return list;
  }, []);
}
function getSchema(fields = [], config) {
  const newSchema = {};
  fields.forEach((field) => {
    if (field.schema) {
      if (field.name) {
        if (field.inputType === supportedTypes.FIELDSET) {
          const fieldsetSchema = buildYupSchema(field, config)();
          newSchema[field.name] = fieldsetSchema;
        } else {
          newSchema[field.name] = field.schema;
        }
      } else {
        Object.assign(newSchema, getSchema(field.fields, config));
      }
    }
  });
  return newSchema;
}
function buildCompleteYupSchema(fields, config) {
  return (0, import_yup.object)().shape(getSchema(fields, config), getNoSortEdges(fields));
}

// src/jsonLogic.js
function createValidationChecker(schema) {
  const scopes = /* @__PURE__ */ new Map();
  function createScopes(jsonSchema, key = "root") {
    const sampleEmptyObject = buildSampleEmptyObject(schema);
    scopes.set(key, createValidationsScope(jsonSchema));
    Object.entries(jsonSchema?.properties ?? {}).filter(([, property]) => property.type === "object" || property.type === "array").forEach(([key2, property]) => {
      if (property.type === "array") {
        createScopes(property.items, `${key2}[]`);
      } else {
        createScopes(property, key2);
      }
    });
    validateInlineRules(jsonSchema, sampleEmptyObject);
  }
  createScopes(schema);
  return {
    scopes,
    getScope(name = "root") {
      return scopes.get(name);
    }
  };
}
function createValidationsScope(schema) {
  const validationMap = /* @__PURE__ */ new Map();
  const computedValuesMap = /* @__PURE__ */ new Map();
  const logic = schema?.["x-jsf-logic"] ?? {
    validations: {},
    computedValues: {}
  };
  const validations = Object.entries(logic.validations ?? {});
  const computedValues = Object.entries(logic.computedValues ?? {});
  const sampleEmptyObject = buildSampleEmptyObject(schema);
  validations.forEach(([id, validation]) => {
    if (!validation.rule) {
      throw Error(`[json-schema-form] json-logic error: Validation "${id}" has missing rule.`);
    }
    checkRuleIntegrity(validation.rule, id, sampleEmptyObject);
    validationMap.set(id, validation);
  });
  computedValues.forEach(([id, computedValue]) => {
    if (!computedValue.rule) {
      throw Error(`[json-schema-form] json-logic error: Computed value "${id}" has missing rule.`);
    }
    checkRuleIntegrity(computedValue.rule, id, sampleEmptyObject);
    computedValuesMap.set(id, computedValue);
  });
  function validate(rule, values) {
    return import_json_logic_js.default.apply(
      rule,
      replaceUndefinedValuesWithNulls({ ...sampleEmptyObject, ...values })
    );
  }
  return {
    validationMap,
    computedValuesMap,
    validate,
    applyValidationRuleInCondition(id, values) {
      const validation = validationMap.get(id);
      return validate(validation.rule, values);
    },
    applyComputedValueInField(id, values, fieldName) {
      const validation = computedValuesMap.get(id);
      if (validation === void 0) {
        throw Error(
          `[json-schema-form] json-logic error: Computed value "${id}" doesn't exist in field "${fieldName}".`
        );
      }
      return validate(validation.rule, values);
    },
    applyComputedValueRuleInCondition(id, values) {
      const validation = computedValuesMap.get(id);
      return validate(validation.rule, values);
    }
  };
}
function replaceUndefinedValuesWithNulls(values = {}) {
  return Object.entries(values).reduce((prev, [key, value]) => {
    return { ...prev, [key]: value === void 0 || value === null ? NaN : value };
  }, {});
}
function yupSchemaWithCustomJSONLogic({ field, logic, config, id }) {
  const { parentID = "root" } = config;
  const validation = logic.getScope(parentID).validationMap.get(id);
  if (validation === void 0) {
    throw Error(
      `[json-schema-form] json-logic error: "${field.name}" required validation "${id}" doesn't exist.`
    );
  }
  return (yupSchema) => yupSchema.test(
    `${field.name}-validation-${id}`,
    validation?.errorMessage ?? "This field is invalid.",
    (value, { parent }) => {
      if (value === void 0 && !field.required)
        return true;
      return import_json_logic_js.default.apply(validation.rule, parent);
    }
  );
}
var HANDLEBARS_REGEX = /\{\{([^{}]+)\}\}/g;
function replaceHandlebarsTemplates({
  value: toReplace,
  logic,
  formValues,
  parentID,
  name: fieldName
}) {
  if (typeof toReplace === "string") {
    return toReplace.replace(HANDLEBARS_REGEX, (match, key) => {
      return logic.getScope(parentID).applyComputedValueInField(key.trim(), formValues, fieldName);
    });
  } else if (typeof toReplace === "object") {
    const { value, ...rules } = toReplace;
    if (Object.keys(rules).length > 1 && !value) {
      throw Error("Cannot define multiple rules without a template string with key `value`.");
    }
    const computedTemplateValue = Object.entries(rules).reduce((prev, [key, rule]) => {
      const computedValue = logic.getScope(parentID).validate(rule, formValues);
      return prev.replaceAll(`{{${key}}}`, computedValue);
    }, value);
    return computedTemplateValue.replace(/\{\{([^{}]+)\}\}/g, (match, key) => {
      return logic.getScope(parentID).applyComputedValueInField(key.trim(), formValues, fieldName);
    });
  }
  return toReplace;
}
function calculateComputedAttributes(fieldParams, { parentID = "root" } = {}) {
  return ({ logic, isRequired, config, formValues }) => {
    const { name, computedAttributes } = fieldParams;
    const attributes = Object.fromEntries(
      Object.entries(computedAttributes).map(handleComputedAttribute(logic, formValues, parentID, name)).filter(([, value]) => value !== null)
    );
    return {
      ...attributes,
      schema: buildYupSchema(
        { ...fieldParams, ...attributes, required: isRequired },
        config,
        logic
      )
    };
  };
}
function handleComputedAttribute(logic, formValues, parentID, name) {
  return ([key, value]) => {
    switch (key) {
      case "description":
        return [key, replaceHandlebarsTemplates({ value, logic, formValues, parentID, name })];
      case "title":
        return ["label", replaceHandlebarsTemplates({ value, logic, formValues, parentID, name })];
      case "x-jsf-errorMessage":
        return [
          "errorMessage",
          handleNestedObjectForComputedValues(value, formValues, parentID, logic, name)
        ];
      case "x-jsf-presentation": {
        if (value.statement) {
          return [
            "statement",
            handleNestedObjectForComputedValues(value.statement, formValues, parentID, logic, name)
          ];
        }
        return [
          key,
          handleNestedObjectForComputedValues(value.statement, formValues, parentID, logic, name)
        ];
      }
      case "const":
      default: {
        if (typeof value === "object" && value.rule) {
          return [key, logic.getScope(parentID).validate(value.rule, formValues)];
        }
        return [key, logic.getScope(parentID).applyComputedValueInField(value, formValues, name)];
      }
    }
  };
}
function handleNestedObjectForComputedValues(values, formValues, parentID, logic, name) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      return [key, replaceHandlebarsTemplates({ value, logic, formValues, parentID, name })];
    })
  );
}
function buildSampleEmptyObject(schema = {}) {
  const sample = {};
  if (typeof schema !== "object" || !schema.properties) {
    return schema;
  }
  for (const key in schema.properties) {
    if (schema.properties[key].type === "object") {
      sample[key] = buildSampleEmptyObject(schema.properties[key]);
    } else if (schema.properties[key].type === "array") {
      const itemSchema = schema.properties[key].items;
      sample[key] = buildSampleEmptyObject(itemSchema);
    } else {
      sample[key] = true;
    }
  }
  return sample;
}
function validateInlineRules(jsonSchema, sampleEmptyObject) {
  const properties = (jsonSchema?.properties || jsonSchema?.items?.properties) ?? {};
  Object.entries(properties).filter(([, property]) => property["x-jsf-logic-computedAttrs"] !== void 0).forEach(([fieldName, property]) => {
    Object.entries(property["x-jsf-logic-computedAttrs"]).filter(([, value]) => typeof value === "object").forEach(([key, item]) => {
      Object.values(item).forEach((rule) => {
        checkRuleIntegrity(
          rule,
          fieldName,
          sampleEmptyObject,
          (item2) => `[json-schema-form] json-logic error: fieldName "${item2.var}" doesn't exist in field "${fieldName}.x-jsf-logic-computedAttrs.${key}".`
        );
      });
    });
  });
}
function checkRuleIntegrity(rule, id, data, errorMessage = (item) => `[json-schema-form] json-logic error: rule "${id}" has no variable "${item.var}".`) {
  Object.entries(rule ?? {}).map(([operator, subRule]) => {
    if (!Array.isArray(subRule) && subRule !== null && subRule !== void 0)
      return;
    throwIfUnknownOperator(operator, subRule, id);
    subRule.map((item) => {
      const isVar = item !== null && typeof item === "object" && Object.hasOwn(item, "var");
      if (isVar) {
        const exists = import_json_logic_js.default.apply({ var: removeIndicesFromPath(item.var) }, data);
        if (exists === null) {
          throw Error(errorMessage(item));
        }
      } else {
        checkRuleIntegrity(item, id, data);
      }
    });
  });
}
function throwIfUnknownOperator(operator, subRule, id) {
  try {
    import_json_logic_js.default.apply({ [operator]: subRule });
  } catch (e) {
    if (e.message === `Unrecognized operation ${operator}`) {
      throw Error(
        `[json-schema-form] json-logic error: in "${id}" rule there is an unknown operator "${operator}".`
      );
    }
  }
}
var regexToGetIndices = /\.\d+\./g;
function removeIndicesFromPath(path) {
  const intermediatePath = path.replace(regexToGetIndices, ".");
  return intermediatePath.replace(/\.\d+$/, "");
}
function processJSONLogicNode({
  node,
  formFields,
  formValues,
  accRequired,
  parentID,
  logic
}) {
  const requiredFields = new Set(accRequired);
  if (node.allOf) {
    node.allOf.map(
      (allOfNode) => processJSONLogicNode({ node: allOfNode, formValues, formFields, logic, parentID })
    ).forEach(({ required: allOfItemRequired }) => {
      allOfItemRequired.forEach(requiredFields.add, requiredFields);
    });
  }
  if (node.if) {
    const matchesPropertyCondition = checkIfConditionMatchesProperties(
      node,
      formValues,
      formFields,
      logic
    );
    const matchesValidationsAndComputedValues = matchesPropertyCondition && checkIfMatchesValidationsAndComputedValues(node, formValues, logic, parentID);
    const isConditionMatch = matchesPropertyCondition && matchesValidationsAndComputedValues;
    let nextNode;
    if (isConditionMatch && node.then) {
      nextNode = node.then;
    }
    if (!isConditionMatch && node.else) {
      nextNode = node.else;
    }
    if (nextNode) {
      const { required: branchRequired } = processNode({
        node: nextNode,
        formValues,
        formFields,
        accRequired,
        logic,
        parentID
      });
      branchRequired.forEach((field) => requiredFields.add(field));
    }
  }
  return { required: requiredFields };
}

// src/helpers.js
var dynamicInternalJsfAttrs = [
  "isVisible",
  // Driven from conditionals state
  "fields",
  // driven from group-array
  "getComputedAttributes",
  // From json-logic
  "computedAttributes",
  // From json-logic
  "calculateConditionalProperties",
  // driven from conditionals
  "calculateCustomValidationProperties",
  // To be deprecated in favor of json-logic
  "scopedJsonSchema",
  // The respective JSON Schema
  // HOTFIX/TODO Internal customizations, check test conditions.test.js for more info.
  "Component",
  "calculateDynamicProperties",
  "visibilityCondition"
];
var dynamicInternalJsfAttrsObj = Object.fromEntries(
  dynamicInternalJsfAttrs.map((k) => [k, true])
);
function removeConditionalStaleAttributes(field, conditionalAttrs, rootAttrs) {
  Object.keys(field).forEach((key) => {
    if (conditionalAttrs[key] === void 0 && rootAttrs[key] === void 0 && // Don't remove attrs that were declared in the root field.
    dynamicInternalJsfAttrsObj[key] === void 0) {
      field[key] = void 0;
    }
  });
}
function hasType(type, typeName) {
  return Array.isArray(type) ? type.includes(typeName) : type === typeName;
}
function getField(fieldName, fields) {
  return fields.find(({ name }) => name === fieldName);
}
function validateFieldSchema(field, value, logic) {
  const validator = buildYupSchema(field, {}, logic);
  return validator().isValidSync(value);
}
function compareFormValueWithSchemaValue(formValue, schemaValue) {
  const currentPropertyValue = typeof schemaValue === "number" ? schemaValue : schemaValue || void 0;
  return String(formValue) === String(currentPropertyValue);
}
function isFieldFilled(fieldValue) {
  return Array.isArray(fieldValue) ? fieldValue.length > 0 : !!fieldValue;
}
function findFirstAnyOfMatch(nodes, formValues) {
  return nodes.find(
    ({ required }) => required?.some((fieldName) => isFieldFilled(formValues[fieldName]))
  ) || nodes[0];
}
function getPrefillSubFieldValues(field, defaultValues, parentFieldKeyPath) {
  let initialValue = defaultValues ?? {};
  let fieldKeyPath = field.name;
  if (parentFieldKeyPath) {
    fieldKeyPath = fieldKeyPath ? `${parentFieldKeyPath}.${fieldKeyPath}` : parentFieldKeyPath;
  }
  const subFields = field.fields;
  if (Array.isArray(subFields)) {
    const subFieldValues = {};
    subFields.forEach((subField) => {
      Object.assign(
        subFieldValues,
        getPrefillSubFieldValues(subField, initialValue[field.name], fieldKeyPath)
      );
    });
    if (field.inputType === supportedTypes.FIELDSET && field.valueGroupingDisabled) {
      Object.assign(initialValue, subFieldValues);
    } else {
      initialValue[field.name] = subFieldValues;
    }
  } else {
    if (typeof initialValue !== "object") {
      console.warn(
        `Field "${parentFieldKeyPath}"'s value is "${initialValue}", but should be type object.`
      );
      initialValue = getPrefillValues([field], {
        // TODO nested fieldsets are not handled
      });
    } else {
      initialValue = getPrefillValues([field], initialValue);
    }
  }
  return initialValue;
}
function getPrefillValues(fields, initialValues = {}) {
  fields.forEach((field) => {
    const fieldName = field.name;
    switch (field.type) {
      case supportedTypes.GROUP_ARRAY: {
        initialValues[fieldName] = initialValues[fieldName]?.map(
          (subFieldValues) => getPrefillValues(field.fields(), subFieldValues)
        );
        break;
      }
      case supportedTypes.FIELDSET: {
        const subFieldValues = getPrefillSubFieldValues(field, initialValues);
        Object.assign(initialValues, subFieldValues);
        break;
      }
      default: {
        if (!initialValues[fieldName]) {
          initialValues[fieldName] = field.default;
        }
        break;
      }
    }
  });
  return initialValues;
}
function updateField(field, requiredFields, node, formValues, logic, config) {
  if (!field) {
    return;
  }
  const fieldIsRequired = requiredFields.has(field.name);
  if (node.properties && hasProperty(node.properties, field.name)) {
    field.isVisible = !!node.properties[field.name];
  }
  if (fieldIsRequired) {
    field.isVisible = true;
  }
  const updateAttributes = (fieldAttrs) => {
    Object.entries(fieldAttrs).forEach(([key, value]) => {
      field[key] = typeof value === "function" ? value() : value;
      if (key === "value") {
        const readOnlyPropertyWasUpdated = typeof fieldAttrs.readOnly !== "undefined";
        const isReadonlyByDefault = field.readOnly;
        const isReadonly = readOnlyPropertyWasUpdated ? fieldAttrs.readOnly : isReadonlyByDefault;
        if (!isReadonly && (value === null || field.inputType === "checkbox")) {
          field.value = void 0;
        }
      }
    });
  };
  if (field.getComputedAttributes) {
    const newAttributes = field.getComputedAttributes({
      field,
      isRequired: fieldIsRequired,
      node,
      formValues,
      config,
      logic
    });
    updateAttributes(newAttributes);
  }
  if (field.calculateConditionalProperties) {
    const { rootFieldAttrs, newAttributes } = field.calculateConditionalProperties({
      isRequired: fieldIsRequired,
      conditionBranch: node,
      formValues
    });
    updateAttributes(newAttributes);
    removeConditionalStaleAttributes(field, newAttributes, rootFieldAttrs);
  }
  if (field.calculateCustomValidationProperties) {
    const newAttributes = field.calculateCustomValidationProperties(
      fieldIsRequired,
      node,
      formValues
    );
    updateAttributes(newAttributes);
  }
}
function processNode({
  node,
  formValues,
  formFields,
  accRequired = /* @__PURE__ */ new Set(),
  parentID = "root",
  logic
}) {
  const requiredFields = new Set(accRequired);
  Object.keys(node.properties ?? []).forEach((fieldName) => {
    const field = getField(fieldName, formFields);
    updateField(field, requiredFields, node, formValues, logic, { parentID });
  });
  node.required?.forEach((fieldName) => {
    requiredFields.add(fieldName);
    updateField(getField(fieldName, formFields), requiredFields, node, formValues, logic, {
      parentID
    });
  });
  if (node.if) {
    const matchesCondition = checkIfConditionMatchesProperties(node, formValues, formFields, logic);
    if (matchesCondition && node.then) {
      const { required: branchRequired } = processNode({
        node: node.then,
        formValues,
        formFields,
        accRequired: requiredFields,
        parentID,
        logic
      });
      branchRequired.forEach((field) => requiredFields.add(field));
    } else if (node.else) {
      const { required: branchRequired } = processNode({
        node: node.else,
        formValues,
        formFields,
        accRequired: requiredFields,
        parentID,
        logic
      });
      branchRequired.forEach((field) => requiredFields.add(field));
    }
  }
  if (node.anyOf) {
    const firstMatchOfAnyOf = findFirstAnyOfMatch(node.anyOf, formValues);
    firstMatchOfAnyOf.required?.forEach((fieldName) => {
      requiredFields.add(fieldName);
    });
    node.anyOf.forEach(({ required = [] }) => {
      required.forEach((fieldName) => {
        const field = getField(fieldName, formFields);
        updateField(field, requiredFields, node, formValues, logic, { parentID });
      });
    });
  }
  if (node.allOf) {
    node.allOf.map(
      (allOfNode) => processNode({
        node: allOfNode,
        formValues,
        formFields,
        accRequired: requiredFields,
        parentID,
        logic
      })
    ).forEach(({ required: allOfItemRequired }) => {
      allOfItemRequired.forEach(requiredFields.add, requiredFields);
    });
  }
  if (node.properties) {
    Object.entries(node.properties).forEach(([name, nestedNode]) => {
      const inputType = getInputType(nestedNode);
      if (inputType === supportedTypes.FIELDSET) {
        processNode({
          node: nestedNode,
          formValues: formValues[name] || {},
          formFields: getField(name, formFields).fields,
          parentID: name,
          logic
        });
      }
    });
  }
  if (node["x-jsf-logic"]) {
    const { required: requiredFromLogic } = processJSONLogicNode({
      node: node["x-jsf-logic"],
      formValues,
      formFields,
      accRequired: requiredFields,
      parentID,
      logic
    });
    requiredFromLogic.forEach((field) => requiredFields.add(field));
  }
  return {
    required: requiredFields
  };
}
function clearValuesIfNotVisible(fields, formValues) {
  fields.forEach(({ isVisible = true, name, inputType, fields: nestedFields }) => {
    if (!isVisible) {
      formValues[name] = null;
    }
    if (inputType === supportedTypes.FIELDSET && nestedFields && formValues[name]) {
      clearValuesIfNotVisible(nestedFields, formValues[name]);
    }
  });
}
function updateFieldsProperties(fields, formValues, jsonSchema, logic) {
  if (!jsonSchema?.properties) {
    return;
  }
  processNode({ node: jsonSchema, formValues, formFields: fields, logic });
  clearValuesIfNotVisible(fields, formValues);
}
var notNullOption = (opt) => opt.const !== null;
function flatPresentation(item) {
  return Object.entries(item).reduce((newItem, [key, value]) => {
    if (key === "x-jsf-presentation") {
      return {
        ...newItem,
        ...value
      };
    }
    return {
      ...newItem,
      [key]: value
    };
  }, {});
}
function getFieldOptions(node, presentation) {
  function convertToOptions(nodeOptions) {
    return nodeOptions.filter(notNullOption).map(({ title, const: cons, ...item }) => ({
      label: title,
      value: cons,
      ...flatPresentation(item)
    }));
  }
  if (presentation.options) {
    return presentation.options;
  }
  if (node.oneOf || presentation.inputType === "radio") {
    return convertToOptions(node.oneOf || []);
  }
  if (node.items?.anyOf) {
    return convertToOptions(node.items.anyOf);
  }
  return null;
}
function extractParametersFromNode(schemaNode) {
  if (!schemaNode) {
    return {};
  }
  const presentation = pickXKey(schemaNode, "presentation") ?? {};
  const errorMessage = pickXKey(schemaNode, "errorMessage") ?? {};
  const jsonLogicValidations = schemaNode["x-jsf-logic-validations"];
  const computedAttributes = schemaNode["x-jsf-logic-computedAttrs"];
  const decoratedComputedAttributes = getDecoratedComputedAttributes(computedAttributes);
  const node = (0, import_omit.default)(schemaNode, ["x-jsf-presentation", "presentation"]);
  const description = presentation?.description || node.description;
  const statementDescription = presentation.statement?.description;
  const value = typeof node.const !== "undefined" && typeof node.default !== "undefined" && node.const === node.default ? { forcedValue: node.const } : {};
  return (0, import_omitBy.default)(
    {
      const: node.const,
      ...value,
      label: node.title,
      readOnly: node.readOnly,
      ...node.deprecated && {
        deprecated: {
          description: presentation.deprecated?.description
          // @TODO/@IDEA These might be useful down the road :thinking:
          // version: presentation.deprecated.version, // e.g. "1.1"
          // replacement: presentation.deprecated.replacement, // e.g. ['contract_duration_type']
        }
      },
      pattern: node.pattern,
      options: getFieldOptions(node, presentation),
      items: node.items,
      maxLength: node.maxLength,
      minLength: node.minLength,
      minimum: node.minimum,
      maximum: node.maximum,
      maxFileSize: node.maxFileSize,
      // @deprecated in favor of presentation.maxFileSize
      default: node.default,
      format: node.format,
      // Checkboxes conditions
      // — For checkboxes that only accept one value (string)
      ...presentation?.inputType === "checkbox" && { checkboxValue: node.const },
      // - For checkboxes with boolean value
      ...presentation?.inputType === "checkbox" && node.type === "boolean" && {
        // true is what describes this checkbox as a boolean, regardless if its required or not
        checkboxValue: true
      },
      ...hasType(node.type, "array") && {
        multiple: true
      },
      // Handle [name].presentation
      ...presentation,
      jsonLogicValidations,
      computedAttributes: decoratedComputedAttributes,
      description,
      extra: presentation.extra,
      statement: presentation.statement && {
        ...presentation.statement,
        description: statementDescription
      },
      // Support scoped conditions (fieldsets)
      if: node.if,
      then: node.then,
      else: node.else,
      anyOf: node.anyOf,
      allOf: node.allOf,
      errorMessage
    },
    import_isNil.default
  );
}
function yupToFormErrors(yupError) {
  if (!yupError) {
    return yupError;
  }
  const errors = {};
  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return (0, import_set.default)(errors, yupError.path, yupError.message);
    }
    yupError.inner.forEach((err) => {
      if (!(0, import_get2.default)(errors, err.path)) {
        (0, import_set.default)(errors, err.path, err.message);
      }
    });
  }
  return errors;
}
var handleValuesChange = (fields, jsonSchema, config, logic) => (values) => {
  updateFieldsProperties(fields, values, jsonSchema, logic);
  const lazySchema = (0, import_yup2.lazy)(() => buildCompleteYupSchema(fields, config));
  let errors;
  try {
    lazySchema.validateSync(values, {
      abortEarly: false
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      errors = err;
    } else {
      console.warn(`Warning: An unhandled error was caught during validationSchema`, err);
    }
  }
  return {
    yupError: errors,
    formErrors: yupToFormErrors(errors)
  };
};
function getDecoratedComputedAttributes(computedAttributes) {
  const isEqualConstAndDefault = computedAttributes?.const === computedAttributes?.default;
  return {
    ...computedAttributes ?? {},
    ...computedAttributes?.const && computedAttributes?.default && isEqualConstAndDefault ? { forcedValue: computedAttributes.const } : {}
  };
}

// src/calculateConditionalProperties.js
function isFieldRequired(node, field) {
  return (
    // Check base root required
    field.scopedJsonSchema?.required?.includes(field.name) || // Check conditional required
    node?.required?.includes(field.name)
  );
}
function rebuildFieldset(fields, property) {
  if (property?.properties) {
    return fields.map((field) => {
      const propertyConditionals = property.properties[field.name];
      if (!propertyConditionals) {
        return field;
      }
      const newFieldParams = extractParametersFromNode(propertyConditionals);
      if (field.fields) {
        return {
          ...field,
          ...newFieldParams,
          fields: rebuildFieldset(field.fields, propertyConditionals)
        };
      }
      return {
        ...field,
        ...newFieldParams,
        required: isFieldRequired(property, field)
      };
    });
  }
  return fields.map((field) => ({
    ...field,
    required: isFieldRequired(property, field)
  }));
}
function calculateConditionalProperties({ fieldParams, customProperties, logic, config }) {
  return ({ isRequired, conditionBranch, formValues }) => {
    const conditionalProperty = conditionBranch?.properties?.[fieldParams.name];
    if (conditionalProperty) {
      const presentation = pickXKey(conditionalProperty, "presentation") ?? {};
      const fieldDescription = getFieldDescription(conditionalProperty, customProperties);
      const newFieldParams = extractParametersFromNode({
        ...conditionalProperty,
        ...fieldDescription
      });
      let fieldSetFields;
      if (fieldParams.inputType === supportedTypes.FIELDSET) {
        fieldSetFields = rebuildFieldset(fieldParams.fields, conditionalProperty);
        newFieldParams.fields = fieldSetFields;
      }
      const { computedAttributes, ...restNewFieldParams } = newFieldParams;
      const calculatedComputedAttributes = computedAttributes ? calculateComputedAttributes(newFieldParams, config)({ logic, formValues }) : {};
      const jsonLogicValidations = [
        ...fieldParams.jsonLogicValidations ?? [],
        ...restNewFieldParams.jsonLogicValidations ?? []
      ];
      const base = {
        isVisible: true,
        required: isRequired,
        ...presentation?.inputType && { type: presentation.inputType },
        ...calculatedComputedAttributes,
        ...calculatedComputedAttributes.value ? { value: calculatedComputedAttributes.value } : { value: void 0 },
        schema: buildYupSchema(
          {
            ...fieldParams,
            ...restNewFieldParams,
            ...calculatedComputedAttributes,
            jsonLogicValidations,
            // If there are inner fields (case of fieldset) they need to be updated based on the condition
            fields: fieldSetFields,
            required: isRequired
          },
          config,
          logic
        )
      };
      return {
        rootFieldAttrs: fieldParams,
        newAttributes: (0, import_omit2.default)((0, import_merge2.default)(base, presentation, newFieldParams), ["inputType"])
      };
    }
    const isVisible = isRequired;
    return {
      rootFieldAttrs: fieldParams,
      newAttributes: {
        isVisible,
        required: isRequired,
        schema: buildYupSchema({
          ...fieldParams,
          ...extractParametersFromNode(conditionBranch),
          required: isRequired
        })
      }
    };
  };
}

// src/calculateCustomValidationProperties.js
var import_inRange = __toESM(require("lodash/inRange"));
var import_isFunction2 = __toESM(require("lodash/isFunction"));
var import_isNil2 = __toESM(require("lodash/isNil"));
var import_isObject = __toESM(require("lodash/isObject"));
var import_mapValues = __toESM(require("lodash/mapValues"));
var import_pick = __toESM(require("lodash/pick"));
var SUPPORTED_CUSTOM_VALIDATION_FIELD_PARAMS = ["minimum", "maximum"];
var isCustomValidationAllowed = (fieldParams) => (customValidation, customValidationKey) => {
  if ((0, import_isNil2.default)(customValidation)) {
    return false;
  }
  const { minimum, maximum } = fieldParams;
  const isAllowed = (0, import_inRange.default)(
    customValidation,
    minimum ?? -Infinity,
    maximum ? maximum + 1 : Infinity
  );
  if (!isAllowed) {
    const errorMessage = `Custom validation for ${fieldParams.name} is not allowed because ${customValidationKey}:${customValidation} is less strict than the original range: ${minimum} to ${maximum}`;
    if (true) {
      throw new Error(errorMessage);
    } else {
      console.warn(errorMessage);
    }
  }
  return isAllowed;
};
function calculateCustomValidationProperties(fieldParams, customProperties) {
  return (isRequired, conditionBranch, formValues) => {
    const params = { ...fieldParams, ...conditionBranch?.properties?.[fieldParams.name] };
    const presentation = pickXKey(params, "presentation") ?? {};
    const supportedParams = (0, import_pick.default)(customProperties, SUPPORTED_CUSTOM_VALIDATION_FIELD_PARAMS);
    const checkIfAllowed = isCustomValidationAllowed(params);
    const customErrorMessages = [];
    const fieldParamsWithNewValidation = (0, import_mapValues.default)(
      supportedParams,
      (customValidationValue, customValidationKey) => {
        const originalValidation = params[customValidationKey];
        const customValidation = (0, import_isFunction2.default)(customValidationValue) ? customValidationValue(formValues, params) : customValidationValue;
        if ((0, import_isObject.default)(customValidation)) {
          if (checkIfAllowed(customValidation[customValidationKey], customValidationKey)) {
            customErrorMessages.push(pickXKey(customValidation, "errorMessage"));
            return customValidation[customValidationKey];
          }
          return originalValidation;
        }
        return checkIfAllowed(customValidation, customValidationKey) ? customValidation : originalValidation;
      }
    );
    const errorMessage = Object.assign({ ...params.errorMessage }, ...customErrorMessages);
    return {
      ...params,
      ...fieldParamsWithNewValidation,
      type: presentation?.inputType || params.inputType,
      errorMessage,
      required: isRequired,
      schema: buildYupSchema({
        ...params,
        ...fieldParamsWithNewValidation,
        errorMessage,
        required: isRequired
      })
    };
  };
}

// src/createHeadlessForm.js
function sortByOrderOrPosition(a, b, order) {
  if (order) {
    return order.indexOf(a.name) - order.indexOf(b.name);
  }
  return a.position - b.position;
}
function removeInvalidAttributes(fields) {
  return (0, import_omit3.default)(fields, ["items", "maxFileSize", "isDynamic"]);
}
function buildFieldParameters(name, fieldProperties, required = [], config = {}, logic) {
  const { position } = pickXKey(fieldProperties, "presentation") ?? {};
  let fields;
  const inputType = getInputType(fieldProperties, config.strictInputType, name);
  if (inputType === supportedTypes.FIELDSET) {
    fields = getFieldsFromJSONSchema(
      fieldProperties,
      {
        customProperties: (0, import_get3.default)(config, `customProperties.${name}.customProperties`, {}),
        parentID: name
      },
      logic
    );
  }
  const result = {
    name,
    inputType,
    jsonType: fieldProperties.type,
    type: inputType,
    // @deprecated in favor of inputType,
    required: required?.includes(name) ?? false,
    fields,
    position,
    ...extractParametersFromNode(fieldProperties)
  };
  return (0, import_omitBy2.default)(result, import_isNil3.default);
}
function convertJSONSchemaPropertiesToFieldParameters({ properties, required, "x-jsf-order": order }, config = {}) {
  const sortFields = (a, b) => sortByOrderOrPosition(a, b, order);
  return Object.entries(properties).filter(([, value]) => typeof value === "object").map(([key, value]) => buildFieldParameters(key, value, required, config)).sort(sortFields).map(({ position, ...fieldParams }) => fieldParams);
}
function applyFieldsDependencies(fieldsParameters, node) {
  if (node?.then) {
    fieldsParameters.filter(
      ({ name }) => node.then?.properties?.[name] || node.then?.required?.includes(name) || node.else?.properties?.[name] || node.else?.required?.includes(name)
    ).forEach((property) => {
      property.isDynamic = true;
    });
    applyFieldsDependencies(fieldsParameters, node.then);
  }
  if (node?.anyOf) {
    fieldsParameters.filter(({ name }) => node.anyOf.some(({ required }) => required?.includes(name))).forEach((property) => {
      property.isDynamic = true;
    });
    applyFieldsDependencies(fieldsParameters, node.then);
  }
  if (node?.allOf) {
    node.allOf.forEach((condition) => {
      applyFieldsDependencies(fieldsParameters, condition);
    });
  }
  if (node?.["x-jsf-logic"]) {
    applyFieldsDependencies(fieldsParameters, node["x-jsf-logic"]);
  }
}
function getCustomPropertiesForField(fieldParams, config) {
  return config?.customProperties?.[fieldParams.name];
}
function getComposeFunctionForField(fieldParams, hasCustomizations) {
  const composeFn = inputTypeMap[fieldParams.inputType] || _composeFieldArbitraryClosure(fieldParams.inputType);
  if (hasCustomizations) {
    return _composeFieldCustomClosure(composeFn);
  }
  return composeFn;
}
function buildField(fieldParams, config, scopedJsonSchema, logic) {
  const customProperties = getCustomPropertiesForField(fieldParams, config);
  const composeFn = getComposeFunctionForField(fieldParams, !!customProperties);
  const yupSchema = buildYupSchema(fieldParams, config, logic);
  const calculateConditionalFieldsClosure = fieldParams.isDynamic && calculateConditionalProperties({ fieldParams, customProperties, logic, config });
  const calculateCustomValidationPropertiesClosure = calculateCustomValidationProperties(
    fieldParams,
    customProperties
  );
  const getComputedAttributes = Object.keys(fieldParams.computedAttributes).length > 0 && calculateComputedAttributes(fieldParams, config);
  const hasCustomValidations = !!customProperties && (0, import_size.default)((0, import_pick2.default)(customProperties, SUPPORTED_CUSTOM_VALIDATION_FIELD_PARAMS)) > 0;
  const finalFieldParams = {
    // invalid attribute cleanup
    ...removeInvalidAttributes(fieldParams),
    // calculateConditionalProperties function if needed
    ...!!calculateConditionalFieldsClosure && {
      calculateConditionalProperties: calculateConditionalFieldsClosure
    },
    // calculateCustomValidationProperties function if needed
    ...hasCustomValidations && {
      calculateCustomValidationProperties: calculateCustomValidationPropertiesClosure
    },
    ...getComputedAttributes && { getComputedAttributes },
    // field customization properties
    ...customProperties && { fieldCustomization: customProperties },
    // base schema
    schema: yupSchema(),
    scopedJsonSchema
  };
  return composeFn(finalFieldParams);
}
function getFieldsFromJSONSchema(scopedJsonSchema, config, logic) {
  if (!scopedJsonSchema) {
    return [];
  }
  const fieldParamsList = convertJSONSchemaPropertiesToFieldParameters(scopedJsonSchema, config);
  applyFieldsDependencies(fieldParamsList, scopedJsonSchema);
  const fields = [];
  fieldParamsList.forEach((fieldParams) => {
    if (fieldParams.inputType === "group-array" || config.config.presentationMapping?.groupArray?.includes(fieldParams.inputType)) {
      const groupArrayItems = convertJSONSchemaPropertiesToFieldParameters(fieldParams.items);
      const groupArrayFields = groupArrayItems.map((groupArrayItem) => {
        groupArrayItem.nameKey = groupArrayItem.name;
        const customProperties = null;
        const composeFn = getComposeFunctionForField(groupArrayItem, !!customProperties);
        return composeFn(groupArrayItem);
      });
      fieldParams.nameKey = fieldParams.name;
      fieldParams.nthFieldGroup = {
        name: fieldParams.name,
        label: fieldParams.label,
        description: fieldParams.description,
        fields: () => groupArrayFields,
        addFieldText: fieldParams.addFieldText
      };
      buildField(fieldParams, config, scopedJsonSchema, logic).forEach((groupField) => {
        fields.push(groupField);
      });
    } else {
      fields.push(buildField(fieldParams, config, scopedJsonSchema, logic));
    }
  });
  return fields;
}
function createHeadlessForm(jsonSchema, customConfig = {}) {
  const config = {
    strictInputType: true,
    ...customConfig
  };
  try {
    const logic = createValidationChecker(jsonSchema);
    const fields = getFieldsFromJSONSchema(jsonSchema, config, logic);
    const handleValidation = handleValuesChange(fields, jsonSchema, config, logic);
    updateFieldsProperties(
      fields,
      getPrefillValues(fields, config.initialValues),
      jsonSchema,
      logic
    );
    return {
      fields,
      handleValidation,
      isError: false
    };
  } catch (error) {
    console.error("JSON Schema invalid!", error);
    return {
      fields: [],
      isError: true,
      error
    };
  }
}
