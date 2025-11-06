// PicoArt v25 - FLUX Depth + 동양화 단순화
// 한국(민화), 일본(우키요에) 고정 / 중국만 AI 선택 (수묵화/공필화)

// Fallback 프롬프트 (AI 실패시 사용)
const fallbackPrompts = {
  ancient: {
    name: '고대 그리스-로마',
    prompt: 'ancient Greek and Roman classical painting style, idealized human forms, marble-like smooth rendering, heroic noble figures, classical drapery, temple architecture, serene dignified expressions, painted in ancient classical masterpiece quality'
  },
  
  byzantineIslamic: {
    name: '비잔틴·이슬람',
    prompt: 'Byzantine and Islamic art style, golden mosaic backgrounds, ornate geometric patterns, rich jewel-like colors, spiritual iconic forms, decorative arabesque motifs, sacred dignified atmosphere, painted in Byzantine-Islamic masterpiece quality'
  },
  
  renaissance: {
    name: '르네상스',
    prompt: 'Renaissance painting style, soft sfumato technique, harmonious balanced composition, warm golden Renaissance colors, detailed naturalistic rendering, gentle serene expressions, classical perspective, painted in Renaissance masterpiece quality'
  },
  
  baroque: {
    name: '바로크',
    prompt: 'Baroque painting style, dramatic chiaroscuro lighting, rich deep colors, dynamic diagonal composition, theatrical emotional atmosphere, strong contrast between light and shadow, painted in Baroque masterpiece quality'
  },
  
  rococo: {
    name: '로코코',
    prompt: 'Rococo painting style, light pastel colors, playful ornate decoration, soft delicate brushwork, romantic elegant atmosphere, graceful curved lines, whimsical charm, painted in Rococo masterpiece quality'
  },
  
  romanticism: {
    name: '낭만주의',
    prompt: 'Romantic painting style, dramatic emotional intensity, sublime natural beauty, vivid expressive colors, dynamic turbulent composition, passionate atmosphere, painted in Romantic masterpiece quality'
  },
  
  impressionism: {
    name: '인상주의',
    prompt: 'Impressionist painting style, visible short brushstrokes, pure unmixed colors, emphasis on natural light effects, outdoor plein-air atmosphere, capturing fleeting moments, painted in Impressionist masterpiece quality'
  },
  
  post_impressionism: {
    name: '후기인상주의',
    prompt: 'Post-Impressionist painting style, bold expressive colors, geometric structured forms, emotional symbolic content, innovative personal vision, painted in Post-Impressionist masterpiece quality'
  },
  
  postImpressionism: {
    name: '후기인상주의',
    prompt: 'Post-Impressionist painting style, bold expressive colors, geometric structured forms, emotional symbolic content, innovative personal vision, painted in Post-Impressionist masterpiece quality'
  },
  
  fauvism: {
    name: '야수파',
    prompt: 'Fauvist painting style, wild pure vivid colors, bold simplified forms, strong non-naturalistic palette, flat decorative patterns, expressive emotional intensity, painted in Fauvist masterpiece quality'
  },
  
  expressionism: {
    name: '표현주의',
    prompt: 'Expressionist painting style, intense emotional colors, distorted exaggerated forms, psychological depth, dramatic angular composition, inner feelings externalized, painted in Expressionist masterpiece quality'
  },
  
  klimt: {
    name: '클림트',
    prompt: 'painting by Gustav Klimt, golden ornamental patterns, Byzantine mosaic influence, decorative symbolic style, sensuous flowing forms, jewel-like colors, Art Nouveau elegance'
  },
  
  picasso: {
    name: '피카소',
    prompt: 'Cubist painting by Pablo Picasso, geometric fragmented forms, multiple simultaneous perspectives, abstract analytical composition, monochromatic or limited palette'
  },
  
  van_gogh: {
    name: '반 고흐',
    prompt: 'painting by Vincent van Gogh, thick expressive swirling brushstrokes, vibrant intense emotional colors, dynamic energetic composition, passionate turbulent style'
  },
  
  matisse: {
    name: '마티스',
    prompt: 'painting by Henri Matisse, bold pure flat colors, simplified harmonious forms, decorative rhythmic patterns, joyful life-affirming atmosphere'
  },
  
  munch: {
    name: '뭉크',
    prompt: 'painting by Edvard Munch, intense emotional psychological depth, symbolic expressive colors, haunting atmospheric mood, existential anxiety visualized'
  },
  
  dali: {
    name: '달리',
    prompt: 'Surrealist painting by Salvador Dalí, dreamlike hyperrealistic details, melting distorted forms, bizarre juxtapositions, subconscious imagery, precise meticulous technique'
  },
  
  // 동양화 - 단순화된 고정 스타일
  korean: {
    name: '한국 민화',
    prompt: 'Korean Minhwa folk painting style with bright vibrant colors from obangsaek palette (red, blue, yellow, green), thick bold black outlines around all shapes, completely flat decorative composition, traditional Korean folk motifs like magpies or tigers or flowers, cheerful optimistic mood, naive playful aesthetic, painted in authentic Korean minhwa masterpiece quality'
  },
  
  chinese_ink: {
    name: '중국 수묵화',
    prompt: 'Chinese ink wash painting (Shuimohua) style with monochrome black ink gradations from deep black to light grey, soft flowing brushstrokes, minimalist composition with elegant empty space, misty mountains or pine trees, serene meditative atmosphere, painted in authentic Chinese literati painting masterpiece quality'
  },
  
  chinese_gongbi: {
    name: '중국 공필화',
    prompt: 'Chinese gongbi meticulous painting style with extremely fine detailed brushwork, delicate precise lines, rich mineral pigments, brilliant colors, birds and flowers subjects, ornate decorative patterns, painted in authentic Chinese imperial court gongbi masterpiece quality'
  },
  
  japanese: {
    name: '일본 우키요에',
    prompt: 'Japanese Ukiyo-e woodblock print style with flat areas of bold solid colors, strong clear black outlines, completely flat two-dimensional composition, decorative patterns, stylized simplified forms, elegant refined Japanese aesthetic, painted in authentic Japanese ukiyo-e masterpiece quality'
  },
  
  masters: {
    name: '거장 화풍',
    prompt: 'Master artist painting style, exceptional technical skill, distinctive artistic vision, profound emotional depth, timeless masterpiece quality'
  },
  
  oriental: {
    name: '동양화',
    prompt: 'Traditional East Asian painting style, ink wash brushwork, minimalist composition, harmony with nature, philosophical contemplation, painted in classical Oriental masterpiece quality'
  }
};

// AI 화가 자동 선택 (타임아웃 포함)
async function selectArtistWithAI(imageBase64, selectedStyle, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    // 모든 카테고리 동일 로직: AI가 사진 분석 후 최적 세부 스타일 선택
    let promptText;
    
    const categoryName = selectedStyle.name;
    const categoryType = selectedStyle.category;
    
    if (categoryType === 'masters') {
      // 거장: 사진에 가장 잘 맞는 시기/스타일 선택
      promptText = `Analyze this photo and select the BEST specific period or style from ${categoryName}'s works that matches this photo.

${categoryName} created works in various periods and styles. Analyze the photo and select which period/style would transform this photo most beautifully.

Instructions:
1. Analyze the photo: subject, mood, colors, composition, lighting, atmosphere
2. Consider ${categoryName}'s different periods and styles (early works, peak period, different techniques)
3. Match the photo's characteristics to the MOST SUITABLE period/style from ${categoryName}'s career
4. Generate a detailed FLUX prompt using that specific period's distinctive characteristics
5. IMPORTANT: Preserve the original subject - if it's a baby, keep it as a baby; if elderly, keep elderly

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo analysis (mood, colors, subject)",
  "selected_artist": "${categoryName}",
  "selected_period": "specific period or style name (e.g. Blue Period, Arles Period, Golden Period)",
  "reason": "why THIS specific period of ${categoryName} matches this photo perfectly",
  "prompt": "painting by ${categoryName} in [specific period], [that period's distinctive techniques and colors], depicting the subject while preserving original features and age"
}

Keep it concise and accurate.`;
      
    } else if (categoryType === 'oriental') {
      // 동양화: 한국/일본 고정, 중국만 AI 선택
      const styleId = selectedStyle.id;
      
      if (styleId === 'korean') {
        // 한국 - 무조건 민화 (AI 선택 없음)
        return {
          success: true,
          artist: '한국 민화',
          reason: 'Korean traditional folk painting style',
          prompt: fallbackPrompts.korean.prompt,
          analysis: 'Korean minhwa style applied'
        };
      }
      
      if (styleId === 'japanese') {
        // 일본 - 무조건 우키요에 (AI 선택 없음)
        return {
          success: true,
          artist: '일본 우키요에',
          reason: 'Japanese traditional ukiyo-e style',
          prompt: fallbackPrompts.japanese.prompt,
          analysis: 'Japanese ukiyo-e style applied'
        };
      }
      
      if (styleId === 'chinese') {
        // 중국 - AI 선택 (수묵화 vs 공필화)
        promptText = `Analyze this photo and select the best Chinese traditional art style.

You must choose between TWO styles only:

Style 1: Chinese Ink Wash Painting (水墨畫 Shuimohua)
- Best for: landscapes, nature, contemplative subjects, simple compositions
- Technique: monochrome black ink, soft brushstrokes, minimalist, empty space
- Mood: serene, meditative, scholarly

Style 2: Chinese Gongbi Meticulous Painting (工筆畫)
- Best for: portraits, flowers, birds, detailed subjects, colorful compositions
- Technique: fine detailed lines, rich mineral colors, ornate patterns
- Mood: decorative, luxurious, imperial

Analyze the photo and choose the MOST suitable style.

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo description (1 sentence)",
  "selected_artist": "Chinese ink wash painting" or "Chinese gongbi painting",
  "selected_style": "ink_wash" or "gongbi",
  "reason": "why this style fits (1 sentence)",
  "prompt": "Complete FLUX prompt starting with 'Chinese [style name] style, [detailed characteristics]...'"
}

Keep it concise and accurate.`;
      }
      
    } else {
      // 미술사조: 사조 내 화가 중 최적 선택
      promptText = `Analyze this photo and select the BEST artist from ${categoryName} period/style to transform it.

Instructions:
1. Analyze: subject, age, mood, composition, lighting
2. Select the MOST SUITABLE ${categoryName} artist for THIS specific photo
3. Generate a detailed prompt for FLUX Depth in that artist's style
4. IMPORTANT: Preserve the original subject - if it's a baby, keep it as a baby; if elderly, keep elderly

Return ONLY valid JSON (no markdown):
{
  "analysis": "brief photo description",
  "selected_artist": "Artist Full Name",
  "reason": "why this artist fits this photo",
  "prompt": "painting by [Artist], [artist's technique], [artist's characteristics], depicting the subject while preserving original features and age"
}

Keep it concise and accurate.`;
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64.split(',')[1]
              }
            },
            {
              type: 'text',
              text: promptText
            }
          ]
        }]
      })
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.content[0].text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const result = JSON.parse(text);
    
    // 검증
    if (!result.prompt || !result.selected_artist) {
      throw new Error('Invalid AI response format');
    }
    
    return {
      success: true,
      artist: result.selected_artist,
      reason: result.reason,
      prompt: result.prompt,
      analysis: result.analysis
    };
    
  } catch (error) {
    clearTimeout(timeout);
    console.error('AI selection failed:', error.message);
    return { success: false, error: error.message };
  }
}

// 메인 핸들러
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, selectedStyle } = req.body;

    // 디버깅 로그
    console.log('=== SDXL Transfer Debug ===');
    console.log('Has REPLICATE_API_KEY:', !!process.env.REPLICATE_API_KEY);
    console.log('Has ANTHROPIC_API_KEY:', !!process.env.ANTHROPIC_API_KEY);
    console.log('Has image:', !!image);
    console.log('Has selectedStyle:', !!selectedStyle);
    console.log('selectedStyle:', selectedStyle);

    if (!process.env.REPLICATE_API_KEY) {
      console.error('ERROR: REPLICATE_API_KEY not configured');
      return res.status(500).json({ error: 'Replicate API key not configured' });
    }

    if (!image || !selectedStyle) {
      console.error('ERROR: Missing image or selectedStyle');
      console.error('image exists:', !!image);
      console.error('selectedStyle:', JSON.stringify(selectedStyle, null, 2));
      return res.status(400).json({ error: 'Missing image or style' });
    }

    // selectedStyle 구조 검증
    if (!selectedStyle.name || !selectedStyle.category) {
      console.error('ERROR: Invalid selectedStyle structure');
      console.error('selectedStyle:', JSON.stringify(selectedStyle, null, 2));
      return res.status(400).json({ 
        error: 'Invalid style structure',
        details: 'Missing name or category'
      });
    }

    let finalPrompt;
    let selectedArtist;
    let selectionMethod;
    let selectionDetails = {};

    // 동양화 중 한국/일본은 AI 없이 바로 처리
    if (selectedStyle.category === 'oriental' && 
        (selectedStyle.id === 'korean' || selectedStyle.id === 'japanese')) {
      console.log(`Oriental art (${selectedStyle.id}) - using direct fallback`);
      
      let fallbackKey;
      if (selectedStyle.id === 'korean') {
        fallbackKey = 'korean';
      } else if (selectedStyle.id === 'japanese') {
        fallbackKey = 'japanese';
      }
      
      const fallback = fallbackPrompts[fallbackKey];
      if (!fallback) {
        throw new Error(`No fallback prompt for: ${fallbackKey}`);
      }
      
      finalPrompt = fallback.prompt;
      selectedArtist = fallback.name;
      selectionMethod = 'oriental_direct';
      selectionDetails = {
        style: fallbackKey
      };
      
    } else if (process.env.ANTHROPIC_API_KEY) {
      // 미술사조/거장/중국 전통회화는 AI 자동 선택 시도
      console.log(`Trying AI artist selection for ${selectedStyle.name}...`);
      
      const aiResult = await selectArtistWithAI(
        image, 
        selectedStyle,  // ← selectedStyle 객체 전체 전달
        8000 // 8초 타임아웃
      );
      
      if (aiResult.success) {
        // AI 성공!
        finalPrompt = aiResult.prompt;
        selectedArtist = aiResult.artist;
        selectionMethod = 'ai_auto';
        selectionDetails = {
          analysis: aiResult.analysis,
          reason: aiResult.reason
        };
        console.log('✅ AI selected:', selectedArtist);
      } else {
        // AI 실패 → Fallback
        console.log('⚠️ AI failed, using fallback');
        
        // 거장/동양화는 id에서 키 추출, 미술사조는 category 사용
        let fallbackKey = selectedStyle.category;
        
        if (selectedStyle.category === 'masters') {
          // 'picasso-master' → 'picasso'
          fallbackKey = selectedStyle.id.replace('-master', '');
          
          // 특수 케이스: vangogh → van_gogh
          if (fallbackKey === 'vangogh') {
            fallbackKey = 'van_gogh';
          }
        } else if (selectedStyle.category === 'oriental') {
          // 'korean' → 'korean' (그대로 사용)
          fallbackKey = selectedStyle.id;
        }
        
        console.log('Using fallback key:', fallbackKey);
        const fallback = fallbackPrompts[fallbackKey];
        
        if (!fallback) {
          console.error('ERROR: No fallback found for key:', fallbackKey);
          console.error('Available categories:', Object.keys(fallbackPrompts));
          throw new Error(`No fallback prompt for: ${fallbackKey}`);
        }
        
        finalPrompt = fallback.prompt;
        selectedArtist = fallback.name;
        selectionMethod = 'fallback';
        selectionDetails = {
          ai_error: aiResult.error
        };
      }
    } else {
      // ANTHROPIC_API_KEY 없음 → Fallback
      console.log('ℹ️ No AI key, using fallback');
      
      // 거장/동양화는 id에서 키 추출, 미술사조는 category 사용
      let fallbackKey = selectedStyle.category;
      
      if (selectedStyle.category === 'masters') {
        // 'picasso-master' → 'picasso'
        fallbackKey = selectedStyle.id.replace('-master', '');
        
        // 특수 케이스: vangogh → van_gogh
        if (fallbackKey === 'vangogh') {
          fallbackKey = 'van_gogh';
        }
      } else if (selectedStyle.category === 'oriental') {
        // 동양화: 간단하게 처리
        if (selectedStyle.id === 'korean') {
          fallbackKey = 'korean';
        } else if (selectedStyle.id === 'chinese') {
          // 중국은 기본 수묵화
          fallbackKey = 'chinese_ink';
        } else if (selectedStyle.id === 'japanese') {
          fallbackKey = 'japanese';
        }
      }
      
      console.log('Using fallback key:', fallbackKey);
      const fallback = fallbackPrompts[fallbackKey];
      
      if (!fallback) {
        console.error('ERROR: No fallback found for key:', fallbackKey);
        console.error('Available categories:', Object.keys(fallbackPrompts));
        throw new Error(`No fallback prompt for: ${fallbackKey}`);
      }
      
      finalPrompt = fallback.prompt;
      selectedArtist = fallback.name;
      selectionMethod = 'fallback_no_key';
    }

    console.log('Final prompt:', finalPrompt);
    
    // FLUX Depth 변환
    const response = await fetch(
      'https://api.replicate.com/v1/models/black-forest-labs/flux-depth-dev/predictions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        },
        body: JSON.stringify({
          input: {
            control_image: image,
            prompt: finalPrompt,
            control_strength: 0.6,
            num_inference_steps: 28,
            guidance_scale: 3.5,
            output_format: 'jpg',
            output_quality: 90
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FLUX Depth error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `FLUX API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('✅ FLUX Depth completed');
    
    // 결과에 선택 정보 포함
    res.status(200).json({
      ...data,
      selected_artist: selectedArtist,
      selection_method: selectionMethod,
      selection_details: selectionDetails
    });
    
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/*
작동 방식:

시나리오 1: AI 성공 (95%)
─────────────────────────
사진: 아기
선택: 바로크

AI 분석 중... (3초)
✅ AI 선택: 루벤스
이유: "아기 그림 전문"
프롬프트: "Baroque by Rubens, cherubic baby..."

FLUX 변환... (30초)
결과: 루벤스 스타일 아기 ✅

시나리오 2: AI 실패 (5%)
─────────────────────────
사진: 아기
선택: 바로크

AI 분석 중... (타임아웃 또는 에러)
⚠️ Fallback 사용
프롬프트: "Baroque style, dramatic lighting..."

FLUX 변환... (30초)
결과: 바로크 스타일 아기 ✅ (화가명 없지만 작동)

시나리오 3: API 키 없음
─────────────────────────
ℹ️ AI 키 없음
Fallback 사용

FLUX 변환... (30초)
결과: 기본 스타일 ✅
*/
