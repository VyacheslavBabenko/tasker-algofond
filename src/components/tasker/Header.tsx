import React from "react";

const Header: React.FC = () => {
  return (
    <div className="bg-white flex min-h-20 w-full items-center gap-[40px_100px] whitespace-nowrap tracking-[0.12px] justify-between flex-wrap px-10 py-[17px] border-[rgba(227,227,227,1)] border-b max-md:max-w-full max-md:px-5">
      <div className="text-[rgba(45,45,45,1)] text-4xl font-medium text-right self-stretch my-auto">
        Таскер
      </div>
      <div className="bg-[rgba(241,241,245,1)] self-stretch flex min-w-60 min-h-[46px] flex-col text-[17px] text-[rgba(146,146,157,1)] font-normal leading-[29px] justify-center w-[398px] my-auto px-5 py-[9px] rounded-[10px]">
        <div className="bg-[rgba(241,241,245,1)] w-[223px] max-w-full overflow-hidden px-9 max-md:px-5">
          Поиск
        </div>
      </div>
    </div>
  );
};

export default Header;
