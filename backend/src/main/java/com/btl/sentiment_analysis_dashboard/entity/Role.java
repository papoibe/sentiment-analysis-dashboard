package com.btl.sentiment_analysis_dashboard.entity;

// Enum dinh nghia 3 vai tro trong he thong theo yeu cau Project Overview
public enum Role {
    ANALYST, // Nguoi phan tich - xem dashboard, bieu do, export bao cao
    MANAGER, // Nguoi quan ly - quan ly data sources, assign review, cau hinh alerts
    ADMIN // Quan tri he thong - quan ly users, cau hinh AI, bao cao he thong
}
