/* eslint-disable no-irregular-whitespace */
module.exports = (context, totalPrice) => {
  return `<html>

<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<meta name=Generator content="Microsoft Word 15 (filtered)">
<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
	{font-family:Calibri;
	panose-1:2 15 5 2 2 2 4 3 2 4;}
@font-face
	{font-family:"Gotham Medium";}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0in;
	font-size:12.0pt;
	font-family:"Calibri",sans-serif;}
.MsoChpDefault
	{font-size:12.0pt;
	font-family:"Calibri",sans-serif;}
@page WordSection1
	{size:595.3pt 841.9pt;
	margin:85.05pt 56.7pt 85.05pt 56.7pt;}
div.WordSection1
	{page:WordSection1;}
-->
</style>

</head>

<body lang=EN-US style='word-wrap:break-word'>

<div class=WordSection1>
<p class=MsoNormal><span lang=DA
style='font-size:16.0pt;font-family:"Gotham Medium";color:black'>INVOICE<br>
</span>

<p class=MsoNormal><span lang=DA style='font-family:"Gotham Medium";color:black'>&nbsp;</span></p>

<table class=MsoTableGrid border=0 cellspacing=0 cellpadding=0 width=784
 style='width:587.85pt;border-collapse:collapse;border:none'>
 <tr style='height:17.6pt'>
  <td width=491 colspan=2 valign=top style='width:368.35pt;border:none;
  border-bottom:solid #AEAAAA 1.5pt;padding:0in 5.4pt 0in 5.4pt;height:17.6pt'>
  <p class=MsoNormal><span lang=DA style='font-size:10.0pt;font-family:"Gotham Medium";
  color:black'>ITEM</span></p>
  </td>
  <td width=146 valign=top style='width:109.75pt;border:none;border-bottom:
  solid #AEAAAA 1.5pt;padding:0in 5.4pt 0in 5.4pt;height:17.6pt'>
  <p class=MsoNormal align=right style='text-align:right'><span lang=DA
  style='font-size:10.0pt;font-family:"Gotham Medium";color:black'>PRICE</span></p>
  </td>
  <td width=146 valign=top style='width:109.75pt;border:none;border-bottom:
  solid #AEAAAA 1.5pt;padding:0in 5.4pt 0in 5.4pt;height:17.6pt'>
  <p class=MsoNormal align=right style='text-align:right'><span lang=DA
  style='font-size:10.0pt;font-family:"Gotham Medium";color:black'>&nbsp;</span></p>
  </td>
 </tr>
 <tr style='height:1.15pt'>
  <td width=491 colspan=2 valign=top style='width:368.35pt;border:none;
  padding:0in 5.4pt 0in 5.4pt;height:1.15pt'>
  <p class=MsoNormal><span lang=DA style='font-family:"Gotham Medium";
  color:black'>&nbsp;</span></p>
  </td>
  <td width=146 valign=top style='width:109.75pt;border:none;padding:0in 5.4pt 0in 5.4pt;
  height:1.15pt'>
  <p class=MsoNormal><span lang=DA style='font-family:"Gotham Medium";
  color:black'>&nbsp;</span></p>
  </td>
  <td width=146 valign=top style='width:109.75pt;border:none;padding:0in 5.4pt 0in 5.4pt;
  height:1.15pt'>
  <p class=MsoNormal><span lang=DA style='font-family:"Gotham Medium";
  color:black'>&nbsp;</span></p>
  </td>
 </tr>
 ${context
   .map((item) => {
     return ` <tr style='height:22.85pt'>
  <td width=491 colspan=2 style='width:368.35pt;padding:0in 5.4pt 0in 5.4pt;
  height:22.85pt'>
  <p class=MsoNormal><span lang=DA style='font-size:8.0pt;font-family:"Gotham Medium";
  color:black'>${item.name}</span></p>
  </td>
  <td width=146 style='width:109.75pt;padding:0in 5.4pt 0in 5.4pt;height:22.85pt'>
  <p class=MsoNormal align=right style='text-align:right'><span lang=DA
  style='font-size:8.0pt;font-family:"Gotham Medium";color:black'><b>${item.price}</b>
  </span></p>
  </td>
  <td width=146 valign=top style='width:109.75pt;padding:0in 5.4pt 0in 5.4pt;
  height:22.85pt'>
  <p class=MsoNormal align=right style='text-align:right'><span lang=DA
  style='font-size:8.0pt;font-family:"Gotham Medium";color:black'>&nbsp;</span></p>
  </td>
 </tr>`;
   })
   .join("\n")}

 <tr style='height:23.85pt'>
  <td width=491 colspan=2 valign=top style='width:368.35pt;padding:0in 5.4pt 0in 5.4pt;
  height:23.85pt'>
  <p class=MsoNormal><span lang=DA style='font-family:"Gotham Medium";
  color:black'>&nbsp;</span></p>
  </td>
  <td width=146 valign=top style='width:109.75pt;padding:0in 5.4pt 0in 5.4pt;
  height:23.85pt'>
  <p class=MsoNormal align=right style='text-align:right'><span lang=DA
  style='font-family:"Gotham Medium";color:black'>&nbsp;</span></p>
  </td>
  <td width=146 valign=top style='width:109.75pt;padding:0in 5.4pt 0in 5.4pt;
  height:23.85pt'>
  <p class=MsoNormal align=right style='text-align:right'><span lang=DA
  style='font-family:"Gotham Medium";color:black'>&nbsp;</span></p>
  </td>
 </tr>
 <tr style='height:1.0pt'>
  <td width=293 valign=top style='width:219.75pt;padding:0in 5.4pt 0in 5.4pt;
  height:1.0pt'>
  <p class=MsoNormal><span lang=DA style='font-family:"Gotham Medium";
  color:black'>&nbsp;</span></p>
  </td>
  <td width=198 style='width:148.6pt;padding:0in 5.4pt 0in 5.4pt;height:1.0pt'>
  <p class=MsoNormal style='line-height:150%'><b></b></p>
  </td>
  <td width=146 valign=top style='width:109.75pt;padding:0in 5.4pt 0in 5.4pt;
  height:1.0pt'>
  <p class=MsoNormal align=right style='text-align:right;line-height:150%'><span
  lang=DA style='font-size:8.0pt;line-height:150%;font-family:"Gotham Medium";
  color:black'><b>TOTAL: ${totalPrice}</b></span></p>
  </td>
  <td width=146 valign=top style='width:109.75pt;padding:0in 5.4pt 0in 5.4pt;
  height:1.0pt'>
  <p class=MsoNormal align=right style='text-align:right'><span lang=DA
  style='font-size:8.0pt;font-family:"Gotham Medium";color:black'>&nbsp;</span></p>
  </td>
 </tr>
</table>

<p class=MsoNormal><span lang=DA style='font-family:"Gotham Medium";color:black'>                      </span></p>

<p class=MsoNormal><span lang=DA style='font-family:"Gotham Medium";color:black'>&nbsp;</span></p>
</body>

</html>
`;
};
