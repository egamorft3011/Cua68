import Image from "next/image";
import Link from "next/link";
import React from "react";
import "./Footer.css";
import { IconButton } from "@mui/material";
import { NewReleases, Newspaper, Telegram, YouTube } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { VisaIcon } from "@/shared/Svgs/Svg.component";
import { PaymentMenuFooter } from "@/datafake/Menu";
import { PageConfig } from "@/interface/PageConfig.interface";

interface FooterProps {
  pageConfig?: PageConfig;
}

export default function FooterPage({ pageConfig }: FooterProps) {
  return (
    <>
      <footer>
        <div className="info-footer">
          <Image src={pageConfig?.site_logo || ""} width={130} height={100} alt="" />
          <div className="info-title">
            <h2>
              {pageConfig?.site_name || ""}
            </h2>
            <p>
              {pageConfig?.site_description || ""}
            </p>
          </div>
        </div>
        <div className="list-menu">
          <div className="menu-1">
            <h3>Thể thao</h3>
            <ul>
              <li>
                <Link href={"#"}>Lịch thi đấu</Link>
              </li>
              <li>
                <Link href={"#"}>Cược thể thao</Link>
              </li>
            </ul>
          </div>
          <div className="menu-1">
            <h3>Về chúng tôi</h3>
            <ul>
              <li>
                <Link href={"#"}>Giới thiệu</Link>
              </li>
              <li>
                <Link href={"#"}>Điều kiện - Điều khoản</Link>
              </li>
              <li>
                <Link href={"#"}>Bảo mật</Link>
              </li>
              <li>
                <Link href={"#"}>Chơi game có trách nhiệm</Link>
              </li>
              <li>
                <Link href={"#"}>Quy định chung</Link>
              </li>
            </ul>
          </div>
          <div className="menu-1">
            <h3>Trò chơi</h3>
            <ul>
              <li>
                <Link href={"#"}>Bắn cá</Link>
              </li>
              <li>
                <Link href={"#"}>Nổ hũ</Link>
              </li>
              <li>
                <Link href={"#"}>Game bài</Link>
              </li>
              <li>
                <Link href={"#"}>Xổ số</Link>
              </li>
            </ul>
          </div>
          <div className="menu-1">
            <h3>Hỗ trợ 24/7</h3>
            <ul>
              <li>
                <Link target="_blank" href={pageConfig?.contact.telegram || "#"}>Trực tuyến 24/7</Link>
              </li>
              <li>
                <Link target="_blank" href={pageConfig?.contact.telegram || "#"}>Cộng đồng</Link>
              </li>
              <li>
                <Link target="_blank" href={pageConfig?.contact.telegram || "#"}>Hướng dẫn nạp rút</Link>
              </li>
            </ul>
          </div>
          <div className="menu-1">
            <h3>Thông tin</h3>
            <ul>
              <li>
                <Link href={"#"}>Khuyến mãi / Sự kiện</Link>
              </li>
              <li>
                <Link href={"#"}>Tin tức</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="title-2">
          <p>Copyright © 2024 Powered By CUA68 All Rights Reserved.</p>
          <div className="title-img2">
            <Image
              src={"/images/copyright-logo.png"}
              alt=""
              width={120}
              height={30}
            />
            <Image
              src={"/images/DMCA_logo-grn-btn100w.png"}
              alt=""
              width={100}
              height={30}
            />
          </div>
        </div>
      </footer>
      <div className="footer-mobile">
        <div className="footer-section">
          <h3>Về chúng tôi</h3>
          <div className="footer-links">
            <button>📘 Giới thiệu</button>
            <button>📜 Quy định</button>
            <button>🔒 Bảo mật</button>
            <button>📖 Hướng dẫn</button>
            <button>📰 Tin tức</button>
          </div>
        </div>

        <div className="footer-section">
          <h3>Liên hệ</h3>
          <div className="footer-links">
            <button>💬 Live chat 24/7</button>
            <button>📲 Telegram CUA68</button>
            <button>👥 Cộng đồng</button>
            <button>📞 Hotline</button>
            <button>📘 Fanpage CUA68</button>
          </div>
        </div>
        <h2>
          CUA68 - Nhà cái thể thao trực tuyến, Siêu chợ games đổi thưởng đỉnh cao
        </h2>
        <p className="footer-note">
          CUA68 là trang cá cược thể thao hấp dẫn, cung cấp đa dạng về sản phẩm
          trò chơi như Thể Thao, Trò Chơi, Casino Trực Tuyến và thưởng hoàn trả
          cao nhất trên thị trường.
        </p>
      </div>
    </>
  );
}
