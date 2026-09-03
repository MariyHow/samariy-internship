import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Skeleton from "../UI/Skeleton"

const API_URL = "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"

const autoplay = (slider) => {
  let timeout
  let mouseOver = false

  function clearNextTimeout() {
    clearTimeout(timeout)
  }
  function nextTimeout() {
    clearTimeout(timeout)

    if (mouseOver) {
      return
    }
    timeout = setTimeout(() => {
      slider.next()
    }, 2500)
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true
      clearNextTimeout()
    })
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false
      nextTimeout()
    })
    nextTimeout()
  })

  slider.on("dragStarted", clearNextTimeout)
  slider.on("animationEnded", nextTimeout)
  slider.on("updated", nextTimeout)
}

const HotCollections = () => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      mode: "snap",
      slides: {
        perView: 4,
        spacing: 16,
      },
      breakpoints: {
        "(max-width: 1200px)": {
          slides: {
            perView: 3,
            spacing: 16,
          },
        },
        "(max-width: 768px)": {
          slides: {
            perView: 2,
            spacing: 12,
          },
        },
        "(max-width: 480px)": {
          slides: {
            perView: 1.2,
            spacing: 12,
          },
        },
      },
    },
    [autoplay]
  )

  useEffect(() => {
    async function fetchHotCollections() {
      try {
        setLoading(true)
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error(`Failed to fetch Hot Collections: ${response.status}`)
        }
        const data = await response.json()
        console.log("Hot Collections:", data)
        setCollections(data)
      } catch (error) {
        console.error("Error fetching hot collections:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHotCollections()
  }, [])

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="hot-collections__skeletons">
            {new Array(4).fill(0).map((_, index) => (
              <div className="hot-collection__skeleton" key={index}>
                <Skeleton
                  width="100%"
                  height="200px"
                  borderRadius="10px 10px 0 0"
                />
                
                <div className="hot-collection__avatar-skeleton">
                  <Skeleton
                    width="60px"
                    height="60px"
                    borderRadius="50%"
                  />
                </div>
                
                <Skeleton
                  width="120px"
                  height="20px"
                  borderRadius="4px"
                />
                
                <Skeleton
                  width="80px"
                  height="16px"
                  borderRadius="4px"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="hot-collections__slider">
            
            <button
              className="hot-collections__arrow hot-collections__arrow--left"
              onClick={() => instanceRef.current?.prev()}
              aria-label="Previous collection"
            >
              &#10094;
            </button>
            
            <div
              ref={sliderRef}
              className="keen-slider"
            >
              {collections.map((collection) => (
                <div
                  className="keen-slider__slide"
                  key={collection.id}
                >
                  <div className="nft_coll">
                    
                    <div className="nft_wrap">
                      <Link to="/item-details">
                        <img
                          src={collection.nftImage}
                          className="lazy img-fluid"
                          alt={collection.title}
                        />
                      </Link>
                    </div>
                    
                    <div className="nft_coll_pp">
                      <Link to="/author">
                        <img
                          className="lazy pp-coll"
                          src={collection.authorImage}
                          alt={`${collection.title} creator`}
                        />
                      </Link>
                      
                      <i className="fa fa-check"></i>
                    </div>
                    
                    <div className="nft_coll_info">
                      <Link to="/explore">
                        <h4>{collection.title}</h4>
                      </Link>
                      
                      <span>NFT #{collection.nftId}</span>
                    </div>
                  
                  </div>
                </div>
              ))}
            </div>
            
            <button
              className="hot-collections__arrow hot-collections__arrow--right"
              onClick={() => instanceRef.current?.next()}
              aria-label="Next collection"
            >
              &#10095;
            </button>
          
          </div>
        )}
      
      </div>
    </section>
  );
};

export default HotCollections;
