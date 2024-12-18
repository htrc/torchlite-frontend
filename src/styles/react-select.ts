export const colourStyles = {
  option: (provided: any) => ({
    ...provided,
    color: 'rgb(229 229 229)',
    backgroundColor: 'rgb(64 64 64)',
    '&:hover': {
      backgroundColor: 'rgb(38 38 38)'
    }
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'rgb(229 229 229)'
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgb(64 64 64)',
    border: '2px solid rgb(82 82 82)'
  }),

  input: (provided: any) => ({
    ...provided,
    color: 'rgb(229 229 229)'
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgb(163 163 163)'
  }),
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'rgb(64 64 64)',
    borderColor: state.isFocused ? 'rgb(163 163 163)' : 'rgb(64 64 64)',
    '&:hover': {
      borderColor: state.isFocused ? 'rgb(163 163 163)' : 'rgb(115 115 115)'
    }
  })
};
