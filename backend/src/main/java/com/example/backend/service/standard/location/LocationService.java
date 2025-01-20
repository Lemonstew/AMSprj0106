package com.example.backend.service.standard.location;

import com.example.backend.dto.standard.location.Location;
import com.example.backend.mapper.standard.location.LocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LocationService {

    final LocationMapper mapper;

    public Map<String, Object> list() {
        List<Location> list = mapper.list();
        Integer countLocation = mapper.countAllLocation();

        return Map.of("list", list, "count", countLocation);
    }

    public void add(Location location) {
        mapper.add(location);
    }
}
