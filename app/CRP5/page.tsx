"use client";
import { CRP5 } from "@/components/CRP-5/CRP5";
import {
  FlightComputersWrapper,
  setWrapperInstance,
  showComputers,
  closeComputers,
  switchComputers,
  switchSides,
  drawDot,
  drawLine,
  clearDrawings,
  incZoom,
  changeZoom,
  decZoom,
} from "../../components/CRP-5/Wrapper";
import { Button } from "@/components/ui/button";
import React, { useEffect, useLayoutEffect } from "react";
import "./style.css";
import { useRouter } from "next/navigation";

const CRP5Page = () => {
  const router = useRouter();
  const openComp = () => {
    const instance = new FlightComputersWrapper();
    setWrapperInstance(instance); // ✅ set the global
    instance.show();
  };

  useEffect(() => {
    // optional cleanup when navigating away
    return () => {
      closeComputers();
    };
  }, []);

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="test-container w-[100dvw] h-[100dvh]">
      <div className="flex flex-row gap-4 p-4">
        <Button onClick={goHome}>Home</Button>
        <Button onClick={openComp}>Flight-comp</Button>
      </div>

      <div id="fltCompsContent" className="block fltCompsContent">
        <div
          className="fltCompsCloseBtn fltCompNormalColor"
          id="fltCompsCloseBtn"
          onClick={closeComputers}
        >
          <div className="pictogram icon-cancel-circled"></div>
        </div>
        <div id="fltCompsWaitPanel" className="hidden fltCompsWaitPanel">
          <img src="/UI/Images/ajax-loader.gif" />
        </div>
        <div className="fltCompsControls" id="fltCompsControls">
          <table className="border-collapse">
            <tbody>
              <tr>
                <td className="align-top">
                  <div
                    className="controlsActive"
                    id="fltCompsControlsHeaderLeft"
                  >
                    <div
                      className="pictogram icon-compass z-[1000]"
                      onClick={() => switchComputers(0)}
                    ></div>
                    CR3
                    <div id="fltCompsControlsTable">
                      <div
                        className="pictogram fltCompNormalColor icon-arrows-ccw z-[999]"
                        onClick={switchSides}
                        c-title="Switch side"
                      ></div>
                      <div className="groupDiv">
                        <div
                          className="pictogram separatorBelow fltCompNormalColor icon-pencil pl-[12px] z-[998]"
                          onClick={drawDot}
                          id="fltCompsDrawDotBtn"
                          c-title="Draw dot"
                        >
                          <div
                            id="fltCompsDrawDotSupp"
                            className="fltCompsDrawDotSuppNormal w-[4px] h-[4px] rounded-[2px]"
                          ></div>
                        </div>
                        <div
                          className="pictogram separatorBelow fltCompNormalColor icon-pencil pl-[12px] z-[997]"
                          onClick={drawLine}
                          id="fltCompsDrawLineBtn"
                          c-title="Draw line"
                        >
                          <div
                            id="fltCompsDrawLineSupp"
                            className="fltCompsDrawDotSuppNormal w-[4px] h-[20px]"
                          ></div>
                        </div>
                        <div
                          className="pictogram fltCompNormalColor icon-trash z-[996]"
                          onClick={clearDrawings}
                          c-title="Clear drawing"
                        ></div>
                      </div>
                      <div
                        className="pictogram fltCompNormalColor icon-plus z-[995]"
                        onClick={incZoom}
                        c-title="Zoom in"
                      ></div>
                      <input
                        name="ctl00$CPH_Main$TP1$FltCompsControl$tbZoom"
                        type="text"
                        id="tbZoom"
                        onChange={changeZoom}
                        value="50"
                        className="hidden"
                      />
                      <div className="ui-slider-dot mt-[15px] mr-[0] mb-[15px] ml-[23px]">
                        <div
                          id="fltCmpSlider"
                          className="ui-slider ui-slider-vertical ui-widget ui-widget-content ui-corner-all"
                        >
                          <div className="ui-slider-range ui-widget-header ui-corner-all ui-slider-range-min h-[0%]"></div>
                          <span className="ui-slider-handle ui-state-default ui-corner-all bottom-[0%]"></span>
                        </div>
                      </div>
                      <div
                        className="pictogram fltCompNormalColor icon-minus z-[994]"
                        onClick={decZoom}
                        c-title="Zoom out"
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="align-top">
                  <div
                    className="controlsInactive"
                    id="fltCompsControlsHeaderRight"
                  >
                    <div
                      className="pictogram icon-compass"
                      onClick={() => switchComputers(1)}
                    ></div>
                    E6B
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <canvas
          id="fltCompsCanvas"
          width="849"
          height="559"
          className="fltCompsCanvas "
        ></canvas>
        <img
          id="cr3_1"
          width="931"
          height="931"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Back/1.png"
          lazy-src="/UI/Images/FlightComp/CR3-Back/1.png"
        />
        <img
          id="cr3_2"
          width="1077"
          height="1077"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Back/2.png"
          lazy-src="/UI/Images/FlightComp/CR3-Back/2.png"
        />
        <img
          id="cr3_3"
          width="1214"
          height="1214"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Back/3.png"
          lazy-src="/UI/Images/FlightComp/CR3-Back/3.png"
        />
        <img
          id="cr3_4"
          width="1194"
          height="1194"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Front/4.png"
          lazy-src="/UI/Images/FlightComp/CR3-Front/4.png"
        />
        <img
          id="cr3_5"
          width="1052"
          height="1052"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Front/5.png"
          lazy-src="/UI/Images/FlightComp/CR3-Front/5.png"
        />
        <img
          id="cr3_6"
          width="584"
          height="664"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Front/6.png"
          lazy-src="/UI/Images/FlightComp/CR3-Front/6.png"
        />
        <img
          id="cr3_1_mask"
          width="931"
          height="931"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Back/1_mask.png"
          lazy-src="/UI/Images/FlightComp/CR3-Back/1_mask.png"
        />
        <img
          id="cr3_2_mask"
          width="1077"
          height="1077"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Back/2_mask.png"
          lazy-src="/UI/Images/FlightComp/CR3-Back/2_mask.png"
        />
        <img
          id="cr3_3_mask"
          width="1214"
          height="1214"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Back/3_mask.png"
          lazy-src="/UI/Images/FlightComp/CR3-Back/3_mask.png"
        />
        <img
          id="cr3_4_mask"
          width="1194"
          height="1194"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Front/4_mask.png"
          lazy-src="/UI/Images/FlightComp/CR3-Front/4_mask.png"
        />
        <img
          id="cr3_5_mask"
          width="1052"
          height="1052"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Front/5_mask.png"
          lazy-src="/UI/Images/FlightComp/CR3-Front/5_mask.png"
        />
        <img
          id="cr3_6_mask"
          width="584"
          height="664"
          className="fltCompImage"
          src="/UI/Images/FlightComp/CR3-Front/6_mask.png"
          lazy-src="/UI/Images/FlightComp/CR3-Front/6_mask.png"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Front/1.png"
          id="e6b_1"
          className="fltCompImage"
          width="716"
          height="1804"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Front/2.png"
          id="e6b_2"
          className="fltCompImage"
          width="900"
          height="1060"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Front/3.png"
          id="e6b_3"
          className="fltCompImage"
          width="881"
          height="881"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Back/4.png"
          id="e6b_4"
          className="fltCompImage"
          width="716"
          height="1804"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Back/5.png"
          id="e6b_5"
          className="fltCompImage"
          width="900"
          height="1060"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Back/6.png"
          id="e6b_6"
          className="fltCompImage"
          width="754"
          height="754"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Front/2_mask.png"
          id="e6b_2_mask"
          className="fltCompImage"
          width="900"
          height="1060"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Front/3_mask.png"
          id="e6b_3_mask"
          className="fltCompImage"
          width="881"
          height="881"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Back/5_mask.png"
          id="e6b_5_mask"
          className="fltCompImage"
          width="900"
          height="1060"
        />
        <img
          lazy-src="/UI/Images/FlightComp/E6B-Back/6_mask.png"
          id="e6b_6_mask"
          className="fltCompImage"
          width="754"
          height="754"
        />
      </div>
    </div>
  );
};

export default CRP5Page;
