import Select from "react-select";

const Index = ({ options, onChange, value }) => {
  return (
    <Select
      options={options}
      placeholder="select categories"
      className="customSelect"
      onChange={onChange}
      defaultValue={value || null}
    />
  );
};

export default Index;
