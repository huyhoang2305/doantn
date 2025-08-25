import React, { useEffect, useState } from 'react';
import { Spin, Alert } from 'antd';
import Slider from 'react-slick';
import { getAllBanners } from '../../services/home/HomeService';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const styles = {
    container: {
        marginBottom: '40px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    slider: {
        '.slick-dots': {
            bottom: '20px',
        },
        '.slick-dots li button:before': {
            color: '#fff',
            opacity: 0.5,
            fontSize: '12px',
        },
        '.slick-dots li.slick-active button:before': {
            opacity: 1,
            color: '#fff',
        },
        '.slick-prev, .slick-next': {
            zIndex: 1,
            width: '40px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
        },
        '.slick-prev:hover, .slick-next:hover': {
            background: 'rgba(255, 255, 255, 0.5)',
        },
        '.slick-prev': {
            left: '20px',
        },
        '.slick-next': {
            right: '20px',
        },
    },
    slide: {
        position: 'relative',
        height: '400px',
    },
    image: {
        width: '100%',
        height: '400px',
        objectFit: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
        padding: '20px',
        color: '#fff',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '8px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    description: {
        fontSize: '16px',
        opacity: 0.9,
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        background: '#f0f2f5',
        borderRadius: '12px',
    },
    error: {
        margin: '20px 0',
    }
};

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const fetchedBanners = await getAllBanners();
                // Filter for active banners only
                const activeBanners = fetchedBanners.filter(banner => banner.isActive === true);
                setBanners(activeBanners);
            } catch (err) {
                setError("Không thể tải banner.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (loading) {
        return (
            <div style={styles.spinner}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Lỗi"
                description={error}
                type="error"
                showIcon
                style={styles.error}
            />
        );
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        fade: true,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false
                }
            }
        ]
    };

    return (
        <div style={styles.container}>
            <Slider {...settings} style={styles.slider}>
                {banners.filter((banner) => banner.isActive)
                .map((banner) => (
                    <div key={banner.id} style={styles.slide}>
                        <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            style={styles.image}
                        />
                        <div style={styles.overlay}>
                            <h3 style={styles.title}>{banner.title}</h3>
                            {banner.description && (
                                <p style={styles.description}>{banner.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Banner;