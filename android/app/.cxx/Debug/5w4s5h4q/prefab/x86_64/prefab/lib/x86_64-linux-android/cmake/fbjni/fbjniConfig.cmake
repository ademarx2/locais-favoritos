if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/ademarneto/.gradle/caches/8.14.3/transforms/e9ef62f83a76b52c7dc91625e1ea4a7b/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.x86_64/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/ademarneto/.gradle/caches/8.14.3/transforms/e9ef62f83a76b52c7dc91625e1ea4a7b/transformed/fbjni-0.7.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

