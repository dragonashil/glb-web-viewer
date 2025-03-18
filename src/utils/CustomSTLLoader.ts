import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { BufferGeometry } from 'three';

// 캐싱을 위한 맵 추가
const geometryCache = new Map<string, BufferGeometry>();

// 진행 중인 로드 요청을 추적
const pendingRequests = new Map<string, Promise<BufferGeometry>>();

export function loadSTLFile(url: string, abortSignal?: AbortSignal): Promise<BufferGeometry> {
    // 캐시된 지오메트리가 있으면 바로 반환
    if (geometryCache.has(url)) {
        console.log('STL 캐시 사용:', url);
        return Promise.resolve(geometryCache.get(url) as BufferGeometry);
    }

    // 이미 진행 중인 요청이 있으면 그 결과를 반환
    if (pendingRequests.has(url)) {
        console.log('STL 기존 요청 재사용:', url);
        return pendingRequests.get(url) as Promise<BufferGeometry>;
    }

    // 새 요청 생성
    const request = new Promise<BufferGeometry>((resolve, reject) => {
        console.log('STL 새 요청 시작:', url);

        // 직접 fetch를 사용하여 파일을 다운로드
        fetch(url, {
            cache: 'force-cache', // 캐싱 설정
            signal: abortSignal     // abort 신호 전달
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.arrayBuffer();
            })
            .then(buffer => {
                try {
                    // 다운로드한 데이터를 STLLoader의 parse 메소드로 직접 전달
                    const loader = new STLLoader();
                    const geometry = loader.parse(buffer);

                    // 지오메트리 최적화
                    geometry.computeVertexNormals();
                    if (!geometry.boundingSphere) {
                        geometry.computeBoundingSphere();
                    }
                    geometry.center();

                    // 캐시에 저장
                    geometryCache.set(url, geometry);

                    // 완료된 요청 맵에서 제거
                    pendingRequests.delete(url);

                    console.log('STL 로드 완료:', url);
                    resolve(geometry);
                } catch (error) {
                    pendingRequests.delete(url);
                    console.error('STL 파싱 오류:', error);
                    reject(error);
                }
            })
            .catch(error => {
                pendingRequests.delete(url);

                // AbortError는 정상적인 취소이므로 로그 출력하지 않음
                if (error.name !== 'AbortError') {
                    console.error('STL 로딩 실패:', error);
                }
                reject(error);
            });
    });

    // 진행 중인 요청 맵에 추가
    pendingRequests.set(url, request);

    return request;
} 