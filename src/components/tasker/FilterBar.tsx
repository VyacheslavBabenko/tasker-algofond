import React from "react";

interface FilterButtonProps {
  label: string;
  active?: boolean;
  width?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  active = false,
  width = "w-[110px]",
}) => {
  return (
    <div
      className={`self-stretch flex flex-col items-stretch whitespace-nowrap justify-center ${width} my-auto px-5 py-2.5 rounded-[10px] ${
        active ? "bg-[rgba(45,45,45,1)] text-white" : ""
      }`}
    >
      <div className="flex w-full gap-2.5">
        <div>{label}</div>
        <img
          src={
            active
              ? "https://cdn.builder.io/api/v1/image/assets/TEMP/126acbad97452121079798b52a72aab32d7cd00fd09a6221a1de34ab37c727de?placeholderIfAbsent=true"
              : "https://cdn.builder.io/api/v1/image/assets/TEMP/73dbabee2a25fe895455e607d6cf46fc6f1ad0758959c7faee3c1abfb7077b27?placeholderIfAbsent=true"
          }
          className="aspect-[0.71] object-contain w-2.5 shrink-0"
          alt=""
        />
      </div>
    </div>
  );
};

const FilterBar: React.FC = () => {
  return (
    <div className="flex w-full flex-wrap mt-10 max-md:max-w-full">
      <div className="rotate-[-3.261738591419099e-20rad] bg-white flex min-h-[79px] items-center gap-2.5 justify-center px-10 border-[rgba(227,227,227,1)] border-t border-r max-md:px-5">
        <div className="bg-[rgba(241,241,245,1)] self-stretch flex items-center gap-2.5 w-[54px] h-[54px] my-auto p-5 rounded-[10px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a298fce3051d4086eba744ad065ffe683f9f26421f9032cafddc9482c2e2435d?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-3.5 self-stretch my-auto"
            alt=""
          />
        </div>
        <div className="self-stretch flex items-center gap-2.5 w-14 my-auto p-5 rounded-[10px]">
          <div className="rotate-[3.261738591419099e-20rad] self-stretch w-4 my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/433a0e445cd1077e2996d56327dcf19fb2d991271247c94124c1470cf338172e?placeholderIfAbsent=true"
              className="aspect-[6.33] object-contain w-full"
              alt=""
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/433a0e445cd1077e2996d56327dcf19fb2d991271247c94124c1470cf338172e?placeholderIfAbsent=true"
              className="aspect-[6.33] object-contain w-full mt-1.5"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="bg-white flex min-w-60 min-h-20 items-center gap-[23px] text-xl text-[rgba(45,45,45,1)] font-medium tracking-[0.12px] justify-between flex-wrap flex-1 shrink basis-[0%] px-10 border-[rgba(227,227,227,1)] border-t max-md:max-w-full max-md:px-5">
        <FilterButton label="Все" active={true} width="w-[95px]" />
        <FilterButton label="Март" width="w-[110px]" />
        <FilterButton label="Денис" width="w-[120px]" />
        <FilterButton label="Дима" width="w-[113px]" />
        <FilterButton label="Дэ Хан" width="w-[126px]" />
        <FilterButton label="Леша" width="w-[113px]" />
        <FilterButton label="Саша" width="w-28" />
        <FilterButton label="Женя" width="w-[113px]" />
        <FilterButton label="Николай" width="w-[142px]" />
        <FilterButton label="Насим" width="w-[123px]" />
        <FilterButton label="Коля" width="w-[107px]" />
        <FilterButton label="Илья" width="w-[109px]" />
      </div>
    </div>
  );
};

export default FilterBar;
