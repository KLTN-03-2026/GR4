import { 
  Swords, 
  Heart, 
  Skull, 
  Smile, 
  Tv, 
  Camera, 
  Play, 
  Info, 
  ChevronRight, 
  Search, 
  Bell, 
  Star,
  PlayCircle,
  Share2,
  Mail,
  User,
  Lock,
  Phone,
  ShieldCheck,
  Check,
  ArrowRight
} from 'lucide-react';

export const FEATURED_MOVIES = [
  {
    id: 1,
    title: "Vương Quốc Cuối Cùng",
    year: 2024,
    quality: "4K",
    rating: 4.8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeFD_TfXw3eBpoCZCSoS8W-5w8SUEeHPNgxMlADL8ceBVN6fYAqe1kRTMnsCKxlrnHzWCHDPB5ZmUwEnO5vIrVWH29nve9TwnhjbJ7NYzQ_526S_3LLEwi9l9E_CWwwFrR82Rf7ST7C-w72QpQstl_hIUZK0U8lL1D-WKveXtj5cNGU08l3aywPAbbJhm4f_tZxP7NmMRKog33SKENOLYIzNwalOsY2COG_rt_8S9FKNF9vCwGqVHDaBT1-EC_4MLrtV8B5XxFBjI"
  },
  {
    id: 2,
    title: "Chuyến Tàu Sao Hỏa",
    year: 2024,
    genre: "Viễn Tưởng",
    rating: 4.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcZgyUxl6JmxmFuvC1L6UAHekBT1-rCtlb-XCLJwqPgPgg_mohmAwlEgR7hZNjPJruDvQNl26IggMax1xfuIRZhB5j9trrixGb9gsjYftZ8x_1d0idHRvEi3obdE5fcGWuV3mxwaOjelxW2HgdrLy0pUJQXFHRTX8xbU2hNAoSSvYKEf6zZLkXnPF37WFBn6bZ9eec5CjUmDez-MS4jAX9ei0-xYmC1MIkYceQEPwJZJPW3Wz16_Y7i6CQ1YR79gaqXYikULdoa88"
  },
  {
    id: 3,
    title: "Bóng Đêm Kiếm Sĩ",
    year: 2024,
    genre: "Hành Động",
    rating: 4.7,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi3Xe8q1lDb3EnWzqP0rz8MfKahLAG3ny9zvzPsJVgfJ_bttx3wkhSZmU358IToJPGC-fRNVPLuq5jyNPctI1uq42mrer41HJwpREorAKuUv5OEFnh8Zr76zNlFvX5ZlREJwMXgLrFAIIdTcSTpaOJ4oEBdT9jKiyNPw-RWiwN9vWTDgQH-Pfb5sDUlD7_Cw_FZivaFHMPVaKujyIElxXn74zj2dmQTbyaUhmmqUKrZj7A2DmZ52QSwLppannHaG8QA1-F8aaqIJ8"
  },
  {
    id: 4,
    title: "Hậu Trường Ống Kính",
    year: 2024,
    genre: "Tài Liệu",
    rating: 4.5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqCqNuC8KzGiWYNjzDx-kijH-ugTgI28GSZFa7v4PyArMznNylYclJMWIMSJj19-PBqZjSmOGJISg-UDwIfALMd8EBZXpgF-EhH3TvQjmi6XTOqwGUyQVdVzK4XQLfdnHjh6iIm0rwjNbs2TBcAFFZSdXkeHfD7qSJjM1DcOvCoDfoxz-j6MbRnj2EfR5xqhuJQrM6T9k3dq81Scv5bNj0ix_UXP8Ny-0RdzqPRnsffLqRN0niWxF5u8hUXTqwk5B2alWwOxm6mkM"
  },
  {
    id: 5,
    title: "Rừng Sương Mù",
    year: 2024,
    genre: "Kinh Dị",
    rating: 4.6,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLDwfmJMqUcu7FHGoSWhZFA_vRQxeBi7PMXrvDjuebOUB3HJ5GKTShmdrkhh9SBuXLBYTqIEm2fKkK4EX4ticANOA90inyVVNzBMbJCrZKm7WhjH-lJYg1EUk3ltnjbMO4AZxL4newmUTCBPMl9Gxn5MsG4ozgINk0syjJQBsMumuhcIgE_yHXxW7VAEFRD_Jzcpi_ulWPH67bi0XuEyxdBnb4LbiZ7Pde_YYxPJAInuL2-x43wddxGP8rCPkmNDXAMs7PmH9EIG4"
  }
];

export const GENRES = [
  { id: 1, name: "Hành động", icon: Swords },
  { id: 2, name: "Tình cảm", icon: Heart },
  { id: 3, name: "Kinh dị", icon: Skull },
  { id: 4, name: "Hài", icon: Smile },
  { id: 5, name: "Anime", icon: Tv },
  { id: 6, name: "Tài Liệu", icon: Camera }
];

export const NEW_UPDATES = [
  {
    id: 6,
    title: "Thiên Hà Vô Tận",
    tag: "Tập 01 - Viễn tưởng thế hệ mới",
    quality: "HD",
    isNew: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsrROKimgV1i9g1eBfrHqu8spysbP17gqdgv07jxNB-CNREUGWCmnw47OzuwDusKMDfn14K6M_NTfgd8NaWTSWiHW1Ew61u-up3QgTgOfQfKLPJKLgMAiGunvfalbZOP1nsfHb5IYFZF4y4m3fkcO4MJ1Lq-iX3GW2aU5QoK57Fimlhildv8-0vs4MTA3pmY7_vJeYwMhr6dhYANvEsqgeD-xfsCYxlkEaIAyKqMVAo-273HZvH6tx4aL8aTsuS8B8HGdhbLZZ6rI",
    year: 2024
  },
  {
    id: 7,
    title: "Bí Ẩn Rừng Già",
    tag: "Tập 12 (Hoàn tất) - Phiêu lưu",
    quality: "4K",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7rYnLo3EbbxupoUWNDW00Q50aeeflc7AF3Mb49YlWB_faP6xwi3lES7GEDvznH4vRLqvovqyXbp-HjSbn36xY07nYYPqw4MdJc5F4I9kFpuRmEv8dIcPqFHSJrdArOFTXgDGMSZi8xkF_eiogQN3eBrImBQsCfE4xD3xaw_hWflgGfw04wlcb_OEVEQRL2V0l70Uv-t3cuW0DdyXkhMitG-oAtpl6pWNronCF9xsGoHnDXFtQmbaX0QfZiIv3aSNLa21YedI_fDI",
    year: 2024
  }
];

export const TRENDING_MOVIES = [
  {
    id: 8,
    title: "Trí Tuệ Nhân Tạo",
    tag: "TOP 1 THẾ GIỚI",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMGYfvCBNg-gL79j7W6OTyUAhGiTVtVrgD2w31OnuKD6rj7hEN6UqOm1eJRdpxnBieV-dyPZiGGiioc_snbk-pNNvgr-GNy1G0ereGf1-S6-0Iu7fadOCJfgUaPLubyZSQWy-Ud6ImxCXcdVakk8CxHxpzv4i952BhwoqLe2Bkdq0gv39_Ujm6WGWwhZgbl4D56VqSiZp-Bb-e_q0TX2ugbuXAcyXA28jd-sa1-eppJOPy064W9j2UyTFVJSO3Wy9XQFAi15Xpf1I",
    year: 2024
  },
  {
    id: 9,
    title: "Lâu Đài Phù Thủy",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChse7K5-U4dOQdiDO8Y2YPYdBJ8kHo3llC9hGgumyVtku029Fl7mDBQGfr0EaEXB5SGIA-UIj2RZYXef_u2FSvKUZv_MAGdZ3zXWin2-cNlZWnYoqgmO7oQ-51zpR0dVjhIr_ZNeA2KIVBPfoRFtQpCEHi2QYeJGpD-uTBcmKnRqZ7EkHFIQS8qOyjufNlbPHNtNJzxY36UA3_ttsGW213Wn8jJ5XjIQyisvx_scwWvxQMyiICWoiWBo_MJddrv5Z0c_L0Y22qoMI",
    year: 2024
  },
  {
    id: 10,
    title: "Rạp Chiếu Đêm",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnaVuC5Xf7YR_42JsRjHAfHx-M4DDLMzRtPd20RZNeEungPta9PDBigc4PsSniQj9pGkmLwSESV4BElk4UROxc12X_FzpZAC5v0O-9GVT2HfJBfWPrrsARcH_s21P3zZQhAo4pSzonheRxep992g6vi7JS8CA-m5N4Ct-d6vF3r4C0FKedosGnnW_Ehr_s2mfQk8Q0iH9yaz6Sig3ByaOVzQXh812R99pTww9t65Jnsn5wIaxXUorGb9kWkHZ47Lgy1B51GDfVQdA",
    year: 2024
  },
  {
    id: 11,
    title: "Ký Ức Phim",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQKcdq9E69f9WAPSTrjmch2cO-yUfn3gZlBOhCIsMcNLDojq_Tgp4T3HBVrw1x90rvNTSOwGPqU9kWhpEH-b1AvMtVZBdvCS11cKr4DQ0joi8dbwmPr78zbhBEASIK6HuF3vqjGEwU2GLtkYCmr5LQjAnFhJHDmZDJ0xylyDH-rtpSCf2GGH7Ls8XDlVwOQ0qBEH2EGqAtEzPmBF-NvSaNTmiX3EC85fXv9laJgUqXKxsiiYU3BObgCvd1DUjSfMQ8dbEkVmEYLzk",
    year: 2024
  },
  {
    id: 12,
    title: "Tốc Độ Ánh Sáng",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrL_NahHIRlHN08gVftToBllPnoa_mjtz9MRhlYYS8NgyyP_yNNO0rioqD9QbBl2cZ6dsKoQPcJyXi9JpVph8gxeW-tOIj-xVILD5KZA_52xuX_a6Uh59eMVMSa-ScOXDhw6guD3l_toL00tnGb-rRhvWyuE8aWemWwMBVi3wN_c5qcC8ZMy3xYNsG18NNPutda0MEZHbzKeqd1de6GFeylNHjLNuWyUrfBZiA6RUF-ODr1bmDqTg_5rz3Rc9mqnZITK40mIXXxIk",
    year: 2024
  },
  {
    id: 13,
    title: "Chiến Binh Cuối Cùng",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7rYnLo3EbbxupoUWNDW00Q50aeeflc7AF3Mb49YlWB_faP6xwi3lES7GEDvznH4vRLqvovqyXbp-HjSbn36xY07nYYPqw4MdJc5F4I9kFpuRmEv8dIcPqFHSJrdArOFTXgDGMSZi8xkF_eiogQN3eBrImBQsCfE4xD3xaw_hWflgGfw04wlcb_OEVEQRL2V0l70Uv-t3cuW0DdyXkhMitG-oAtpl6pWNronCF9xsGoHnDXFtQmbaX0QfZiIv3aSNLa21YedI_fDI",
    year: 2024
  }
];

export const FILTER_MOVIES = [
  {
    id: 13,
    title: "Kẻ Vô Diện: Trỗi Dậy",
    year: 2024,
    genre: "Hành động",
    rating: 8.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChoi6t1GBrOEYeYpIQf29tzN_PhwRjeE1upAZx1bCHI4dSvpeApEyqHZBQLAzm9BOOb_85Q_ENDalRFkon7pGjG5GIzDpcUhKkphM3Ypz3oqUlNH2vlq8quIwirwibVL8fcCmdQC0ue9P6wThm082guUyQaqFvLS06W1sLCUX3qaHO4RG-jzn1AeqGicFizqbsmcCCaRs5-VESjnTB9kJfcFMAC3DKxI_HwjMB2Q-rXaHI6hPsXlDsvfs_FCyct7OCW_ohJYvxMco"
  },
  {
    id: 14,
    title: "Vọng Âm Cuối Cùng",
    year: 2023,
    genre: "Tâm lý",
    rating: 9.2,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwd0PwKo_b1dk1eSEbX-8RW7iE0AAn334PeZFDx7UkJNa3QqYrnCF4817-M08Xz8jPqTqWHEHKGe0zmOShjYjKQxjDxet83TF_v8BVzVNey_km4pcb7BTw4My-50QvHVJSGOE9M9hhzWykaRkpf_l_USSyOeHiPgKE529aEePDv_Z5reaP4apaiTB8XZFj0GAUQ7Ay3hpL7zCxzOkGO8omMottCXk21WRqLDx-r8Tew0NMljPXOp4192IOskRXPo0IPOVfcVnMPjs"
  },
  {
    id: 15,
    title: "Nghịch Đảo Thời Gian",
    year: 2024,
    genre: "Viễn tưởng",
    rating: 7.8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwPKk7ivAXhOg3G4Jtywd1u6tX8HdV-X-rNegdkAzZLKOqmw9qqN2m_V31phP6CnTp36-T1If4RZZOi8Vtt6MfkzWlEMs0ujRPmTh_3VTlIQYk2v6230e8u74XlS_m8HnuHk6NfCQN4A_9feip9N6TNMshyWvQYMkwZ82jKGWEt8e5IlbVjIWh5jo2sIKiFbycQxGN9MoHstCZ-9lYDSNxn-PX-xe9pHTJqAgnGKFwGwTu4YMnrN-pRD320wmqMxXZ64tLMihatYM"
  },
  {
    id: 16,
    title: "Tiếng Gọi Bóng Đêm",
    year: 2024,
    genre: "Kinh dị",
    rating: 8.1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9aa8gpwaZvfMHygAYNgQCq7xUVZzRUrDYvW3OcoIrPrjHsj_-1cVyYe5rd94v1pATrKY5UUzop1TV7-ggCZOBglq9bwCj0Moorb5-o6FrL1GctsSy-bWOWf8HAkenvx07wynsoamzFja8txhZpnDJrcrcvJrCkXyu4_KnP5TTqB0fz_CGh_je8uGm7Q-_Qgj_VqEYv1EpXkQEMxrALxnBgwxRkw5b1Cw-NDrl4RUFtu2I696-uFnh-KnDqvPrrnric1g72U8LyGM"
  },
  {
    id: 17,
    title: "Xứ Sở Diệu Kỳ",
    year: 2023,
    genre: "Hoạt hình",
    rating: 8.5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-5E_1kGEk2Ves71ZWJsjyYUs-j3TJBlFm7fkfMAcmmz7RMHDqoTGYCVUf1hhpFE_LHMv46QzvsFkkqOEzENK5ZtTXZccUTALAbZM9PYgIY2LWQtrKgftWiWcaQoKgvFSNlAeBKai8qPY9zHA71WALfrBXfQoI04asoUTPgfVMf5XhGtqcEy3dD0Ul4nf9i2_wbT4IbG7y0uoVlBRHOEj8GHXIP_9H06gGHBdL-OBrw6MXYxVj0wApKcWe5mNTnvTWBkQk7tGvHM4"
  },
  {
    id: 18,
    title: "Thành Phố Không Ngủ",
    year: 2022,
    genre: "Tội phạm",
    rating: 8.7,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDV9X7jfEAAyRy0otxP2FGXr_qzwPosCfKMiHyD5eBoY-DMd3lVyUzNAEhgwmDvSKTUCxESEHzxEuSRyC9u_mj9uvr0vWKo9hdk3o6G_joKphVvnnpQv8QFoPm94DPtzxTgiAvJGQwoDWgeaAYfifXTfhzm_PeTEETUMN4mWqS2uofypwmuSJCFTSNdnTEPY1O9MF2UAxwhTU1CW24166JGv3ndZqaO4WxYjiBQ5P05KaiTiX45S6lMlTswvAXo-EAi4a3PjZjgCoE"
  },
  {
    id: 19,
    title: "Ký Ức Hoàng Hôn",
    year: 2023,
    genre: "Chính kịch",
    rating: 9.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGParrYptWS9hx-ozrmLGAiGP2d_YSpeagNZEOBrxEOFFlEBd5lYDnpwdUIhHV-8o7rDYumaX_4oxalks6DrCoked4zgdJYs_QGjAcred2jYyNbv0kau0YMNvTFvqpFUJCu38gfvvx4aRe7QbFpJpDG1KowCYAwh5On-ZMb9l91ShUuvsPP_6EDdEr2GqYQAEjmi0hBaoQ0WWE_cH6adc082Yq4SuCXnm9STyKpOvTwcmc3oIQk5_GF4uyww0IE0RbubCrrsVLWBE"
  },
  {
    id: 20,
    title: "Hành Trình Vô Tận",
    year: 2024,
    genre: "Phiêu lưu",
    rating: 7.5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdEZOVDguFcCs9x5zElq6IgBqJTWNEpeLiAoqMOSsAH1RZEU743rdueaDLMpHpdd3zLiMphdQA0KObyCAaQSBAAgw3E-nrgc-eFWiNdfMzFhVXURzFvs2NBZh4EdOTj_TdUfqsb-jsyjd_B3DA-d5D2gmtRkyMwjUIVUchBMMOD7JT8bCivA2YbD0A_bkDBCgH57o4aXhb5IhstQvSGLGpxq0QQvyruLx_LV8UGWCREUK_13mg6aAq7HQetswxbtW1Zyxl3PbGM1s"
  }
];

export const CAST = [
  { name: "Leonardo D.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV-1YivTmG7A45W2C_Q9NxixiAZwPI57ngLFWNCrhUuaZylhOKA3mF-5Af-Pa_yOM0OLGIpZMdSamrBV03GSTVm7frQguOZ6vr-w2_tW4JH0NHjMhLVGBW80Rb9cY9ImoGEIDYaVWh3RAdq04vL61LlIfa4r_mo3oqsqy0Pxc3spp-xGj8ZPU2it1TdUNpQzQ4z2gIltS5VcEnrOGgDfOQJwER8l-3ogQ-vCUGk1M5bMcJTAt7PNzY6EGSVFe3OyuFaYXhhMwSPqE" },
  { name: "Margot R.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD20WkjUcUDN1Xj5iTt7MdVoZ4I-LN7z1YA0j-mKwniFzjLpQyJnIZ0XhXclteF6hkCQR_jZ87NY8JVRNhqF0pBrEddCO03UmTvumb2S_mp_sZ6Pr-POrto14YwR4ZBaymZgdvrKP30PUuiWZkW4nrZy_K2vhiYSAEfgiQ5-R4Uz4SlwNCxykjYtzJBoGCEtRfFTzzZUIsCvDGzYft4kF0vy5WoQ4QhQa15IyJX_547PhpaQfpXlJ0A5xfkK_H_29gNsqir1Cb2Grk" },
  { name: "Cillian M.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9zDlpiF-GvqBBd-0OrjVOYaj4XMVm-DhaAhcmeYnWrVygq2wVlXDlZ3BrQJ1w-Tiu0wNuIjq2WbbrO06KfC1fsN7mu1HSWLYuLuhlapo7dBdWNYOPeik0b_EEMYV4hAwTyV5SHtEpPmzR_UKVG7bkh1dwyCCpcp2xZpiMW_OamSGz-odW9FtvMdVFc47DRwsY6U7MSUtwpTh4z--elIR0BEiLapyZtvAmyjMu_Saze33JwHirWTswPVbliqHtqfJ8B_EsKNo91Kc" }
];

export const COMMENTS = [
  {
    id: 1,
    user: "Minh Hoàng",
    time: "2 giờ trước",
    content: "Phim thực sự quá xuất sắc! Kỹ xảo mãn nhãn và cốt truyện lôi cuốn từ đầu đến cuối. Rất đáng xem!",
    likes: 24,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz7bZSJqF-mE9NUMnUCdWoDzNI-r-Qx5R16UNcEfkkCExg16SXuLB4lB95wcfVgXB3DAKknkymWwZaZjwB4MApUcYHyJmzQ-zUAQLXDM4QHsv9InGNS8iqQozpLYCj9jW2Yj2n5lGaKI3WzcjnL5bwGTtnUqfchTTiT_GEPwf4Gl5x2niPP-cPY1QUyQBNA6PbZ34WsJ1msyzE0sVoCmhxE1eST5wwvKUzWcWyge88bi_p0y1uge9anrsnW6qhP7Kxtuv_IXwKfTQ"
  },
  {
    id: 2,
    user: "Linh Nga",
    time: "5 giờ trước",
    content: "Mặc dù hơi dài nhưng không thấy mệt chút nào. Cillian Murphy diễn quá đỉnh.",
    likes: 12,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoodPBxJJwmwV9V3gyetPU9OdEOGgLryL0pzxSNB3cgH9i9imxyhmWsKVyxVzJdcR0XYKjQplKuuqX_TcVCWqripk7Y2we4ltOBhlXLN_91Exrb-EZgBFvOjUEdxtLQC0Bjd0n1nutzSzRHTA-rqGsJSuaGzIVzI-svJb_gZeR-8dEr2RJdIHw_aQDvmbMO3bDuV5LQsmw4HuoFodgeI7IzIohovDeoddhe-OjsRKIntyh9WrMLbk3uRp-Jn_TRa6cRPnNeIMw42c"
  }
];
