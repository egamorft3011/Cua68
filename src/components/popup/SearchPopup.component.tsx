import React, { useState } from "react";
import CustomizedDialog from "../subMenu/SubMenu.component";

type SearchPopupProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  games: { id: string; name: string; link: string }[];
};

export default function SearchPopupComponent({
  open,
  onClose,
  title,
  games,
}: SearchPopupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState(games);

  // Xử lý tìm kiếm khi nhập
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredGames(
      games.filter((game) =>
        game.name.toLowerCase().includes(term)
      )
    );
  };

  return (
    <CustomizedDialog open={open} onClose={onClose} title={title}>
      <div className="search-popup">
        <input
          type="text"
          placeholder="Nhập tên game..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <ul className="game-list">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <li key={game.id}>
                <a href={game.link} onClick={onClose}>
                  {game.name}
                </a>
              </li>
            ))
          ) : (
            <li>Không tìm thấy game nào</li>
          )}
        </ul>
      </div>
    </CustomizedDialog>
  );
}